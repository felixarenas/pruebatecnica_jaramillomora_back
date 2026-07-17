import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
    FILE_NAME,
    FILE_SCHEMA,
    IfcAPI,
    IFCRELASSOCIATESMATERIAL,
} from 'web-ifc';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AgrupacionIfcEntity } from 'src/modules/process-ifc/entities/agrupacion-ifc.entity';
import { ElementoIfcEntity } from 'src/modules/process-ifc/entities/elemento-ifc.entity';
import { PropertySetIfcEntity } from 'src/modules/process-ifc/entities/property-set-ifc.entity';
import { AgrupacionIfcRepository } from 'src/modules/process-ifc/interfaces/agrupacion-ifc.interfaces';
import { CantidadIfcRepository } from 'src/modules/process-ifc/interfaces/cantidad-ifc.interfaces';
import { ElementoIfcRepository } from 'src/modules/process-ifc/interfaces/elemento-ifc.interfaces';
import { ModeloIfcRepository } from 'src/modules/process-ifc/interfaces/modelo-ifc.interfaces';
import { PropiedadParametroRepository } from 'src/modules/process-ifc/interfaces/propiedad-parametro.interfaces';
import { PropertySetIfcRepository } from 'src/modules/process-ifc/interfaces/property-set-ifc.interfaces';
import {
    AgrupacionIfcTableData,
    CantidadIfcTableData,
    ElementoIfcTableData,
    IfcCategoriaResumen,
    IfcElementosPorNivel,
    IfcMaterialResumen,
    IfcProcessByNamePayload,
    IfcProcessPayload,
    IfcProcessedData,
    ModeloIfcTableData,
    ProcessIfcResult,
    ProcessIfcResultByTableAgrupacion,
    ProcessIfcResultByTableCantidad,
    ProcessIfcResultByTableElemento,
    ProcessIfcResultByTableModelo,
    ProcessIfcResultByTablePropiedadParametro,
    ProcessIfcResultByTablePropertySet,
    PropiedadParametroTableData,
    PropertySetIfcTableData,
} from './interfaces/ifc-processing.interface';

/** Nodo de la estructura espacial de web-ifc */
interface SpatialNode {
    expressID: number;
    type: string;
    children?: SpatialNode[];
}

/** Tipos espaciales / contenedores que no cuentan como elementos de categoría */
const SPATIAL_TYPE_NAMES = new Set([
    'IFCPROJECT',
    'IFCSITE',
    'IFCBUILDING',
    'IFCBUILDINGSTOREY',
    'IFCSPACE',
    'IFCZONE',
]);

/**
 * Tipos espaciales que se persisten como agrupaciones (excluye el proyecto raíz).
 */
const AGRUPACION_TYPE_NAMES = new Set([
    'IFCSITE',
    'IFCBUILDING',
    'IFCBUILDINGSTOREY',
    'IFCSPACE',
    'IFCZONE',
]);

@Injectable()
export class IfcProcessingService implements OnModuleInit {
    private ifcApi!: IfcAPI;
    private readonly logger = new Logger(IfcProcessingService.name);
    /** Carpeta storage de la aplicación (`src/storage`) */
    private readonly storagePath = path.join(process.cwd(), 'src', 'storage');

    constructor(
        private readonly modeloIfcRepository: ModeloIfcRepository,
        private readonly agrupacionIfcRepository: AgrupacionIfcRepository,
        private readonly elementoIfcRepository: ElementoIfcRepository,
        private readonly propertySetIfcRepository: PropertySetIfcRepository,
        private readonly propiedadParametroRepository: PropiedadParametroRepository,
        private readonly cantidadIfcRepository: CantidadIfcRepository,
    ) { }

    async onModuleInit(): Promise<void> {
        this.ifcApi = new IfcAPI();
        const wasmPath = path.dirname(require.resolve('web-ifc')) + path.sep;
        this.ifcApi.SetWasmPath(wasmPath, true);
        await this.ifcApi.Init();
        this.logger.log('web-ifc API inicializada correctamente');
    }

    async processIfcFile(
        payload: IfcProcessByNamePayload,
    ): Promise<ProcessIfcResult> {
        let modelID: number | null = null;

        try {
            const dataPath: IfcProcessPayload = {
                filePath: path.join(this.storagePath, payload.nom_file),
            };

            const ifcData = await fs.readFile(dataPath.filePath);
            const rawFileData = new Uint8Array(ifcData);

            modelID = this.ifcApi.OpenModel(rawFileData);
            this.logger.log(`Modelo IFC abierto: modelID=${modelID}`);

            const spatialTree = (await this.ifcApi.properties.getSpatialStructure(
                modelID,
                false,
            )) as SpatialNode;

            const categorias = this.buildCategorias(spatialTree);
            const elementosPorNivel = this.buildElementosPorNivel(
                modelID,
                spatialTree,
            );
            const materiales = this.buildMateriales(modelID);

            const totalesElementos = categorias.reduce(
                (sum, item) => sum + item.cantidad,
                0,
            );

            const existingModel = await this.modeloIfcRepository.findByName(payload.nom_file);
            if (existingModel) {

                const data: IfcProcessedData = {
                    modelID,
                    categorias,
                    elementosPorNivel,
                    materiales,
                };

                return {
                    status: true,
                    message: 'El modelo ya existe en la base de datos, se envio la informacion del modelo para actualizar',
                    data,
                };
            }

            const dataByTableModelo = await this.getInfoByTableModelo_ifc(
                payload,
                modelID,
                totalesElementos,
            );
            if (!dataByTableModelo.status || !dataByTableModelo.data) {
                return {
                    status: false,
                    message:
                        'No se pudo procesar el archivo en el storage: ' +
                        dataByTableModelo.message,
                    data: {},
                };
            }

            const modeloIfc = await this.modeloIfcRepository.create(
                dataByTableModelo.data,
            );
            this.logger.log(
                `Modelo IFC persistido: id=${modeloIfc.id}, archivo=${modeloIfc.nombreArchivo}`,
            );

            const dataByTableAgrupacion =
                await this.getInfoByTableAgrupacion_ifc(
                    modeloIfc.id,
                    modelID,
                    spatialTree,
                );

            if (!dataByTableAgrupacion.status || !dataByTableAgrupacion.data) {
                return {
                    status: false,
                    message:
                        'No se pudo procesar el archivo en el storage: ' +
                        dataByTableAgrupacion.message,
                    data: {},
                };
            }

            const agrupacionesIfc = await this.agrupacionIfcRepository.create(
                dataByTableAgrupacion.data,
            );
            this.logger.log(
                `Agrupaciones IFC persistidas: count=${agrupacionesIfc.length}, modelo_id=${modeloIfc.id}`,
            );

            const dataByTableElemento = await this.getInfoByTableElemento_ifc(
                modeloIfc.id,
                modelID,
                spatialTree,
                agrupacionesIfc,
            );

            if (!dataByTableElemento.status || !dataByTableElemento.data) {
                return {
                    status: false,
                    message:
                        'No se pudo procesar el archivo en el storage: ' +
                        dataByTableElemento.message,
                    data: {},
                };
            }

            const elementosIfc = await this.elementoIfcRepository.create(
                dataByTableElemento.data,
            );
            this.logger.log(
                `Elementos IFC persistidos: count=${elementosIfc.length}, modelo_id=${modeloIfc.id}`,
            );

            const dataByTableProperty_set =
                await this.getInfoByTableProperty_set(
                    modelID,
                    spatialTree,
                    elementosIfc,
                );

            if (
                !dataByTableProperty_set.status ||
                !dataByTableProperty_set.data
            ) {
                return {
                    status: false,
                    message:
                        'No se pudo procesar el archivo en el storage: ' +
                        dataByTableProperty_set.message,
                    data: {},
                };
            }

            const propertySetsIfc = await this.propertySetIfcRepository.create(
                dataByTableProperty_set.data,
            );
            this.logger.log(
                `Property Sets IFC persistidos: count=${propertySetsIfc.length}, elementos=${elementosIfc.length}`,
            );

            const dataByTablePropiedadParametro =
                await this.getInfoByTablePropiedadParametro(
                    modelID,
                    spatialTree,
                    elementosIfc,
                    propertySetsIfc,
                );

            if (
                !dataByTablePropiedadParametro.status ||
                !dataByTablePropiedadParametro.data
            ) {
                return {
                    status: false,
                    message:
                        'No se pudo procesar el archivo en el storage: ' +
                        dataByTablePropiedadParametro.message,
                    data: {},
                };
            }

            const propiedadParametro =
                await this.propiedadParametroRepository.create(
                    dataByTablePropiedadParametro.data,
                );
            this.logger.log(
                `Propiedad Parametro IFC persistidos: count=${propiedadParametro.length}, property_sets=${propertySetsIfc.length}`,
            );

            const dataByTableCantidad_ifc =
                await this.getInfoByTableCantidad_ifc(
                    modelID,
                    spatialTree,
                    elementosIfc,
                );

            if (
                !dataByTableCantidad_ifc.status ||
                !dataByTableCantidad_ifc.data
            ) {
                return {
                    status: false,
                    message:
                        'No se pudo procesar el archivo en el storage: ' +
                        dataByTableCantidad_ifc.message,
                    data: {},
                };
            }

            const cantidadIfc = await this.cantidadIfcRepository.create(
                dataByTableCantidad_ifc.data,
            );
            this.logger.log(
                `Cantidad IFC persistidos: count=${cantidadIfc.length}, elementos=${elementosIfc.length}`,
            );

            const data: IfcProcessedData = {
                modelID,
                categorias,
                elementosPorNivel,
                materiales,
            };

            return {
                status: true,
                message: 'IFC procesado correctamente',
                data,
            };
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Error desconocido';
            this.logger.error(
                `No se pudo procesar el archivo en ${payload.nom_file}: ${message}`,
            );
            return {
                status: false,
                message: `No se pudo procesar el archivo en el storage: ${message}`,
                data: {},
            };
        } finally {
            if (modelID !== null && this.ifcApi.IsModelOpen(modelID)) {
                this.ifcApi.CloseModel(modelID);
            }
        }
    }
    /**
     * Obtiene información del modelo IFC para almacenar en la base de datos
     * en la tabla modelo_ifc (cabecera STEP + totales de elementos).
     * @param payload - Payload con el nombre del archivo IFC
     * @param modelID - Identificador del modelo abierto en web-ifc
     * @param totalesElementos - Cantidad total de elementos contables
     * @returns Resultado con los datos listos para persistir
     */
    async getInfoByTableModelo_ifc(
        payload: IfcProcessByNamePayload,
        modelID: number,
        totalesElementos: number,
    ): Promise<ProcessIfcResultByTableModelo> {
        try {
            const esquemaIfc = this.extractSchemaFromHeader(modelID);
            if (!esquemaIfc) {
                return {
                    status: false,
                    message:
                        'No se pudo obtener el esquema IFC (FILE_SCHEMA) del archivo',
                    data: null,
                };
            }

            const data: ModeloIfcTableData = {
                nombre_archivo: payload.nom_file,
                esquema_ifc: esquemaIfc,
                fecha_procesado: new Date(),
                aplicacion_creadora: this.extractOriginatingSystem(modelID),
                totales_elementos: totalesElementos,
            };

            return {
                status: true,
                message: 'Datos de modelo_ifc obtenidos correctamente',
                data,
            };
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Error desconocido';
            this.logger.error(
                `Error al obtener datos para modelo_ifc (${payload.nom_file}): ${message}`,
            );
            return {
                status: false,
                message,
                data: null,
            };
        }
    }

    /**
     * Lee FILE_SCHEMA del encabezado STEP del modelo abierto.
     */
    private extractSchemaFromHeader(modelID: number): string | null {
        try {
            const header = this.ifcApi.GetHeaderLine(modelID, FILE_SCHEMA) as {
                arguments?: unknown[];
            };
            const schemaList = header?.arguments?.[0];
            if (Array.isArray(schemaList) && schemaList.length > 0) {
                const first = this.readIfcString(schemaList[0]);
                if (first) return first.toUpperCase();
            }
            const direct = this.readIfcString(schemaList);
            return direct ? direct.toUpperCase() : null;
        } catch (error) {
            this.logger.warn(
                `No se pudo leer FILE_SCHEMA: ${error instanceof Error ? error.message : error
                }`,
            );
            return null;
        }
    }

    /**
     * Lee originating_system / preprocessor_version de FILE_NAME.
     * Índices STEP: 4=preprocessor_version, 5=originating_system.
     */
    private extractOriginatingSystem(modelID: number): string | null {
        try {
            const header = this.ifcApi.GetHeaderLine(modelID, FILE_NAME) as {
                arguments?: unknown[];
            };
            const args = header?.arguments ?? [];
            const originating = this.readIfcString(args[5]);
            if (originating) return originating;
            return this.readIfcString(args[4]);
        } catch (error) {
            this.logger.warn(
                `No se pudo leer FILE_NAME: ${error instanceof Error ? error.message : error
                }`,
            );
            return null;
        }
    }

    /**
     * Extrae nodos espaciales (sitio, edificio, niveles, espacios, zonas)
     * listos para persistir en `agrupacion_ifc`, vinculados a `modelo_id`.
     * @param modeloId - PK de `modelo_ifc` (resultado de `modeloIfcRepository.create`)
     * @param modelID - Identificador del modelo abierto en web-ifc
     * @param spatialTree - Estructura espacial del modelo
     */
    async getInfoByTableAgrupacion_ifc(
        modeloId: number,
        modelID: number,
        spatialTree: SpatialNode,
    ): Promise<ProcessIfcResultByTableAgrupacion> {
        try {
            const data: AgrupacionIfcTableData[] = [];
            const seenGlobalIds = new Set<string>();

            const walk = (node: SpatialNode): void => {
                const typeNorm = this.normalizeTypeName(node.type);
                if (AGRUPACION_TYPE_NAMES.has(typeNorm)) {
                    const { nombre, globalId } = this.resolveAgrupacionMeta(
                        modelID,
                        node.expressID,
                        node.type,
                    );

                    // `global_id_ifc` es UNIQUE: omitir duplicados dentro del mismo lote
                    const isDuplicate =
                        globalId !== null && seenGlobalIds.has(globalId);
                    if (!isDuplicate) {
                        if (globalId) seenGlobalIds.add(globalId);
                        data.push({
                            modelo_id: modeloId,
                            tipo_agrupacion: node.type || typeNorm,
                            nombre,
                            global_id_ifc: globalId,
                        });
                    }
                }

                for (const child of node.children ?? []) {
                    walk(child);
                }
            };

            walk(spatialTree);

            return {
                status: true,
                message: 'Datos de agrupacion_ifc obtenidos correctamente',
                data,
            };
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Error desconocido';
            this.logger.error(
                `Error al obtener datos para agrupacion_ifc (modelo_id=${modeloId}): ${message}`,
            );
            return {
                status: false,
                message,
                data: null,
            };
        }
    }

    /**
     * Resuelve nombre y GlobalId de un nodo espacial para `agrupacion_ifc`.
     */
    private resolveAgrupacionMeta(
        modelID: number,
        expressID: number,
        typeFallback: string,
    ): { nombre: string; globalId: string | null } {
        try {
            const line = this.ifcApi.GetLine(modelID, expressID, false) as Record<
                string,
                unknown
            >;
            const nombre =
                this.readIfcString(line.Name) ||
                this.readIfcString(line.LongName) ||
                `${typeFallback || 'Agrupacion'}_${expressID}`;
            const globalId = this.readIfcString(line.GlobalId);
            return { nombre, globalId };
        } catch {
            return {
                nombre: `${typeFallback || 'Agrupacion'}_${expressID}`,
                globalId: null,
            };
        }
    }

    /**
     * Extrae elementos contables por cada agrupación persistida
     * (según `tipoAgrupacion`) y los prepara para `elemento_ifc`.
     * @param modeloId - PK de `modelo_ifc`
     * @param modelID - Identificador del modelo abierto en web-ifc
     * @param spatialTree - Estructura espacial del modelo
     * @param agrupacionesIfc - Agrupaciones ya persistidas
     */
    async getInfoByTableElemento_ifc(
        modeloId: number,
        modelID: number,
        spatialTree: SpatialNode,
        agrupacionesIfc: AgrupacionIfcEntity[],
    ): Promise<ProcessIfcResultByTableElemento> {
        try {
            const data: ElementoIfcTableData[] = [];
            const seenGlobalIds = new Set<string>();

            for (const agrupacion of agrupacionesIfc) {
                const tipoNorm = this.normalizeTypeName(
                    agrupacion.tipoAgrupacion,
                );
                if (!AGRUPACION_TYPE_NAMES.has(tipoNorm)) {
                    this.logger.warn(
                        `Agrupación id=${agrupacion.id} con tipo no soportado: ${agrupacion.tipoAgrupacion}`,
                    );
                    continue;
                }

                const node = this.findSpatialNodeForAgrupacion(
                    spatialTree,
                    modelID,
                    agrupacion,
                );
                if (!node) {
                    this.logger.warn(
                        `No se encontró nodo espacial para agrupación id=${agrupacion.id} tipo=${agrupacion.tipoAgrupacion} nombre=${agrupacion.nombre}`,
                    );
                    continue;
                }

                const ownedNodes = this.collectOwnedElementNodes(node);
                for (const elementNode of ownedNodes) {
                    const meta = this.resolveElementoMeta(
                        modelID,
                        elementNode.expressID,
                        elementNode.type,
                    );
                    if (!meta.globalId) {
                        continue;
                    }
                    if (seenGlobalIds.has(meta.globalId)) {
                        continue;
                    }
                    seenGlobalIds.add(meta.globalId);

                    data.push({
                        modelo_id: modeloId,
                        agrupacion_id: agrupacion.id,
                        global_id: meta.globalId,
                        tipo_entidad_ifc: this.truncate(
                            elementNode.type || agrupacion.tipoAgrupacion,
                            100,
                        ),
                        nombre: meta.nombre,
                        etiqueta_id: meta.etiquetaId,
                    });
                }
            }

            return {
                status: true,
                message: 'Datos de elemento_ifc obtenidos correctamente',
                data,
            };
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Error desconocido';
            this.logger.error(
                `Error al obtener datos para elemento_ifc (modelo_id=${modeloId}): ${message}`,
            );
            return {
                status: false,
                message,
                data: null,
            };
        }
    }

    /**
     * Localiza el nodo espacial correspondiente a una agrupación persistida
     * (por GlobalId, o por tipo + nombre como respaldo).
     */
    private findSpatialNodeForAgrupacion(
        root: SpatialNode,
        modelID: number,
        agrupacion: AgrupacionIfcEntity,
    ): SpatialNode | null {
        const tipoNorm = this.normalizeTypeName(agrupacion.tipoAgrupacion);
        let foundByName: SpatialNode | null = null;

        const walk = (node: SpatialNode): SpatialNode | null => {
            const nodeTipo = this.normalizeTypeName(node.type);
            if (nodeTipo === tipoNorm) {
                const { nombre, globalId } = this.resolveAgrupacionMeta(
                    modelID,
                    node.expressID,
                    node.type,
                );

                if (
                    agrupacion.globalIdIfc &&
                    globalId &&
                    globalId === agrupacion.globalIdIfc
                ) {
                    return node;
                }

                if (
                    !foundByName &&
                    nombre === agrupacion.nombre &&
                    (!agrupacion.globalIdIfc || !globalId)
                ) {
                    foundByName = node;
                }
            }

            for (const child of node.children ?? []) {
                const hit = walk(child);
                if (hit) return hit;
            }
            return null;
        };

        return walk(root) ?? foundByName;
    }

    /**
     * Elementos contables bajo una agrupación, sin cruzar a agrupaciones hijas
     * (cada elemento queda asociado a su contenedor espacial más cercano).
     */
    private collectOwnedElementNodes(agrupacionNode: SpatialNode): SpatialNode[] {
        const result: SpatialNode[] = [];

        const walk = (node: SpatialNode): void => {
            for (const child of node.children ?? []) {
                const childTipo = this.normalizeTypeName(child.type);
                if (AGRUPACION_TYPE_NAMES.has(childTipo)) {
                    continue;
                }
                if (this.isCountableElement(child.type)) {
                    result.push(child);
                }
                walk(child);
            }
        };

        walk(agrupacionNode);
        return result;
    }

    /**
     * Resuelve GlobalId, nombre y Tag de un elemento IFC.
     */
    private resolveElementoMeta(
        modelID: number,
        expressID: number,
        typeFallback: string,
    ): {
        globalId: string | null;
        nombre: string | null;
        etiquetaId: string | null;
    } {
        try {
            const line = this.ifcApi.GetLine(modelID, expressID, false) as Record<
                string,
                unknown
            >;
            const globalId = this.readIfcString(line.GlobalId);
            const nombre =
                this.readIfcString(line.Name) ||
                this.readIfcString(line.LongName) ||
                null;
            const etiquetaId = this.readIfcString(line.Tag);
            return {
                globalId: globalId
                    ? this.truncate(globalId, 50)
                    : null,
                nombre: nombre ? this.truncate(nombre, 255) : null,
                etiquetaId: etiquetaId
                    ? this.truncate(etiquetaId, 50)
                    : null,
            };
        } catch {
            return {
                globalId: null,
                nombre: typeFallback ? this.truncate(typeFallback, 255) : null,
                etiquetaId: null,
            };
        }
    }

    private truncate(value: string, max: number): string {
        return value.length <= max ? value : value.slice(0, max);
    }

    /**
     * Extrae IfcPropertySet de cada elemento persistido (por GlobalId / tipo)
     * y los prepara para la tabla `property_set`.
     * @param modelID - Identificador del modelo abierto en web-ifc
     * @param spatialTree - Estructura espacial del modelo
     * @param elementosIfc - Elementos ya persistidos (`elementoIfcRepository.create`)
     */
    async getInfoByTableProperty_set(
        modelID: number,
        spatialTree: SpatialNode,
        elementosIfc: ElementoIfcEntity[],
    ): Promise<ProcessIfcResultByTablePropertySet> {
        try {
            const expressIdByGlobalId = this.buildExpressIdByGlobalIdMap(
                modelID,
                spatialTree,
            );
            const data: PropertySetIfcTableData[] = [];
            const seenKeys = new Set<string>();

            for (const elemento of elementosIfc) {
                const expressID = expressIdByGlobalId.get(elemento.globalId);
                if (expressID === undefined) {
                    this.logger.warn(
                        `No se encontró expressID para elemento id=${elemento.id} global_id=${elemento.globalId} tipo=${elemento.tipoEntidadIfc}`,
                    );
                    continue;
                }

                let psets: unknown[];
                try {
                    psets = await this.ifcApi.properties.getPropertySets(
                        modelID,
                        expressID,
                        false,
                        true,
                    );
                } catch (error) {
                    this.logger.warn(
                        `No se pudieron leer psets del elemento id=${elemento.id} tipo=${elemento.tipoEntidadIfc}: ${error instanceof Error ? error.message : error
                        }`,
                    );
                    continue;
                }

                for (const pset of psets ?? []) {
                    const nombrePset = this.extractPropertySetName(pset);
                    if (!nombrePset) continue;

                    const key = `${elemento.id}:${nombrePset}`;
                    if (seenKeys.has(key)) continue;
                    seenKeys.add(key);

                    data.push({
                        elemento_id: elemento.id,
                        nombre_pset: this.truncate(nombrePset, 150),
                    });
                }
            }

            return {
                status: true,
                message: 'Datos de property_set obtenidos correctamente',
                data,
            };
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Error desconocido';
            this.logger.error(
                `Error al obtener datos para property_set: ${message}`,
            );
            return {
                status: false,
                message,
                data: null,
            };
        }
    }

    /**
     * Mapa GlobalId → expressID recorriendo la estructura espacial.
     */
    private buildExpressIdByGlobalIdMap(
        modelID: number,
        root: SpatialNode,
    ): Map<string, number> {
        const map = new Map<string, number>();

        const walk = (node: SpatialNode): void => {
            if (node.expressID > 0) {
                try {
                    const line = this.ifcApi.GetLine(
                        modelID,
                        node.expressID,
                        false,
                    ) as Record<string, unknown>;
                    const globalId = this.readIfcString(line.GlobalId);
                    if (globalId && !map.has(globalId)) {
                        map.set(globalId, node.expressID);
                    }
                } catch {
                    // nodo sin línea legible
                }
            }
            for (const child of node.children ?? []) {
                walk(child);
            }
        };

        walk(root);
        return map;
    }

    /**
     * Nombre del pset si es IfcPropertySet (u homólogo con Name usable).
     */
    private extractPropertySetName(pset: unknown): string | null {
        if (!pset || typeof pset !== 'object') return null;
        const record = pset as Record<string, unknown>;

        if (typeof record.type === 'number') {
            const typeName = this.normalizeTypeName(
                this.ifcApi.GetNameFromTypeCode(record.type),
            );
            // Solo PropertySet (las cantidades van a cantidad_ifc)
            if (typeName && typeName !== 'IFCPROPERTYSET') {
                return null;
            }
        }

        return this.readIfcString(record.Name);
    }

    /**
     * Extrae propiedades/parámetros de cada PropertySet persistido
     * y los prepara para la tabla `propiedad_parametro`.
     * Usa `propertySetsIfc.id` como `pset_id` (FK a `property_set`).
     * Recorre los psets asociados a cada elemento (por `tipo_entidad_ifc` / GlobalId).
     * @param modelID - Identificador del modelo abierto en web-ifc
     * @param spatialTree - Estructura espacial del modelo
     * @param elementosIfc - Elementos ya persistidos
     * @param propertySetsIfc - Property sets ya persistidos (`propertySetIfcRepository.create`)
     */
    async getInfoByTablePropiedadParametro(
        modelID: number,
        spatialTree: SpatialNode,
        elementosIfc: ElementoIfcEntity[],
        propertySetsIfc: PropertySetIfcEntity[],
    ): Promise<ProcessIfcResultByTablePropiedadParametro> {
        try {
            const expressIdByGlobalId = this.buildExpressIdByGlobalIdMap(
                modelID,
                spatialTree,
            );
            const elementoById = new Map(
                elementosIfc.map((elemento) => [elemento.id, elemento]),
            );

            /** Agrupa psets persistidos por elemento para leer el IFC una sola vez */
            const psetsByElementoId = new Map<number, PropertySetIfcEntity[]>();
            for (const pset of propertySetsIfc) {
                if (pset.elementoId == null) continue;
                const list = psetsByElementoId.get(pset.elementoId) ?? [];
                list.push(pset);
                psetsByElementoId.set(pset.elementoId, list);
            }

            const data: PropiedadParametroTableData[] = [];
            const seenKeys = new Set<string>();

            for (const [elementoId, psetsPersistidos] of psetsByElementoId) {
                const elemento = elementoById.get(elementoId);
                if (!elemento) {
                    this.logger.warn(
                        `No se encontró elemento id=${elementoId} para property_sets asociados`,
                    );
                    continue;
                }

                const expressID = expressIdByGlobalId.get(elemento.globalId);
                if (expressID === undefined) {
                    this.logger.warn(
                        `No se encontró expressID para elemento id=${elemento.id} tipo=${elemento.tipoEntidadIfc} global_id=${elemento.globalId}`,
                    );
                    continue;
                }

                let psetsIfc: unknown[];
                try {
                    // recursive=true para expandir HasProperties
                    psetsIfc = await this.ifcApi.properties.getPropertySets(
                        modelID,
                        expressID,
                        true,
                        true,
                    );
                } catch (error) {
                    this.logger.warn(
                        `No se pudieron leer propiedades del elemento id=${elemento.id} tipo=${elemento.tipoEntidadIfc}: ${error instanceof Error ? error.message : error
                        }`,
                    );
                    continue;
                }

                const psetByName = new Map<string, unknown>();
                for (const pset of psetsIfc ?? []) {
                    const nombrePset = this.extractPropertySetName(pset);
                    if (!nombrePset) continue;
                    if (!psetByName.has(nombrePset)) {
                        psetByName.set(nombrePset, pset);
                    }
                }

                for (const propertySet of psetsPersistidos) {
                    const psetIfc = psetByName.get(propertySet.nombrePset);
                    if (!psetIfc) {
                        this.logger.warn(
                            `No se encontró pset IFC "${propertySet.nombrePset}" para property_set id=${propertySet.id} elemento tipo=${elemento.tipoEntidadIfc}`,
                        );
                        continue;
                    }

                    const propiedades = this.extractPropiedadesFromPset(psetIfc);
                    for (const prop of propiedades) {
                        const key = `${propertySet.id}:${prop.nombre_propiedad}`;
                        if (seenKeys.has(key)) continue;
                        seenKeys.add(key);

                        data.push({
                            pset_id: propertySet.id,
                            nombre_propiedad: this.truncate(
                                prop.nombre_propiedad,
                                150,
                            ),
                            valor: prop.valor
                                ? this.truncate(prop.valor, 255)
                                : null,
                            tipo_valor: prop.tipo_valor
                                ? this.truncate(prop.tipo_valor, 50)
                                : null,
                        });
                    }
                }
            }

            return {
                status: true,
                message: 'Datos de propiedad_parametro obtenidos correctamente',
                data,
            };
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Error desconocido';
            this.logger.error(
                `Error al obtener datos para propiedad_parametro: ${message}`,
            );
            return {
                status: false,
                message,
                data: null,
            };
        }
    }

    /**
     * Extrae propiedades simples (y anidadas de IfcComplexProperty) de un pset.
     */
    private extractPropiedadesFromPset(
        pset: unknown,
    ): Array<{
        nombre_propiedad: string;
        valor: string | null;
        tipo_valor: string | null;
    }> {
        if (!pset || typeof pset !== 'object') return [];
        const record = pset as Record<string, unknown>;
        const hasProperties = this.asArray(record.HasProperties);
        const result: Array<{
            nombre_propiedad: string;
            valor: string | null;
            tipo_valor: string | null;
        }> = [];

        for (const prop of hasProperties) {
            result.push(...this.flattenIfcProperty(prop));
        }

        return result;
    }

    /**
     * Normaliza una propiedad IFC (single/enumerated/list/complex) a filas planas.
     */
    private flattenIfcProperty(
        prop: unknown,
        namePrefix = '',
    ): Array<{
        nombre_propiedad: string;
        valor: string | null;
        tipo_valor: string | null;
    }> {
        if (!prop || typeof prop !== 'object') return [];
        const record = prop as Record<string, unknown>;

        const typeName = this.resolveIfcTypeName(record);
        const baseName = this.readIfcString(record.Name);
        if (!baseName) return [];

        const nombre =
            namePrefix.length > 0 ? `${namePrefix}.${baseName}` : baseName;

        // IfcComplexProperty: expandir HasProperties anidados
        if (typeName === 'IFCCOMPLEXPROPERTY') {
            const nested = this.asArray(record.HasProperties);
            const rows: Array<{
                nombre_propiedad: string;
                valor: string | null;
                tipo_valor: string | null;
            }> = [];
            for (const child of nested) {
                rows.push(...this.flattenIfcProperty(child, nombre));
            }
            return rows;
        }

        const { valor, tipoValor } = this.extractIfcPropertyValue(record, typeName);
        return [
            {
                nombre_propiedad: nombre,
                valor,
                tipo_valor: tipoValor,
            },
        ];
    }

    private resolveIfcTypeName(record: Record<string, unknown>): string {
        if (typeof record.type === 'number') {
            return this.normalizeTypeName(
                this.ifcApi.GetNameFromTypeCode(record.type),
            );
        }
        if (typeof record.constructor?.name === 'string') {
            return this.normalizeTypeName(record.constructor.name);
        }
        return '';
    }

    /**
     * Obtiene valor textual y tipo de una propiedad IFC.
     */
    private extractIfcPropertyValue(
        record: Record<string, unknown>,
        typeName: string,
    ): { valor: string | null; tipoValor: string | null } {
        if (
            typeName === 'IFCPROPERTYENUMERATEDVALUE' ||
            Array.isArray(record.EnumerationValues)
        ) {
            const values = this.asArray(record.EnumerationValues)
                .map((v) => this.stringifyIfcValue(v))
                .filter((v): v is string => v != null);
            return {
                valor: values.length > 0 ? values.join(', ') : null,
                tipoValor: typeName || 'IFCPROPERTYENUMERATEDVALUE',
            };
        }

        if (
            typeName === 'IFCPROPERTYLISTVALUE' ||
            Array.isArray(record.ListValues)
        ) {
            const values = this.asArray(record.ListValues)
                .map((v) => this.stringifyIfcValue(v))
                .filter((v): v is string => v != null);
            return {
                valor: values.length > 0 ? values.join(', ') : null,
                tipoValor: typeName || 'IFCPROPERTYLISTVALUE',
            };
        }

        if (typeName === 'IFCPROPERTYBOUNDEDVALUE') {
            const lower = this.stringifyIfcValue(record.LowerBoundValue);
            const upper = this.stringifyIfcValue(record.UpperBoundValue);
            const parts = [lower, upper].filter(Boolean);
            return {
                valor: parts.length > 0 ? parts.join(' .. ') : null,
                tipoValor: typeName,
            };
        }

        // IfcPropertySingleValue (y fallback genérico)
        const nominal = record.NominalValue;
        const valor = this.stringifyIfcValue(nominal);
        const tipoFromValue = this.resolveIfcValueTypeName(nominal);
        return {
            valor,
            tipoValor: tipoFromValue || typeName || 'IFCPROPERTYSINGLEVALUE',
        };
    }

    private resolveIfcValueTypeName(value: unknown): string | null {
        if (!value || typeof value !== 'object') return null;
        const record = value as Record<string, unknown>;
        if (typeof record.type === 'number') {
            const name = this.normalizeTypeName(
                this.ifcApi.GetNameFromTypeCode(record.type),
            );
            return name || null;
        }
        return null;
    }

    private stringifyIfcValue(value: unknown): string | null {
        if (value == null) return null;
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }
        if (typeof value === 'object') {
            const record = value as Record<string, unknown>;
            if ('value' in record) {
                const inner = record.value;
                if (
                    typeof inner === 'string' ||
                    typeof inner === 'number' ||
                    typeof inner === 'boolean'
                ) {
                    return String(inner);
                }
                if (inner != null && typeof inner === 'object') {
                    return this.stringifyIfcValue(inner);
                }
            }
            // Algunos wrappers anidan NominalValue / WrappedValue
            if ('NominalValue' in record) {
                return this.stringifyIfcValue(record.NominalValue);
            }
        }
        return null;
    }

    /**
     * Extrae cantidades físicas (IfcElementQuantity / Qto) de cada elemento
     * persistido y las prepara para la tabla `cantidad_ifc`.
     * Usa `elementosIfc.id` como `elemento_id` (FK a `elemento_ifc`).
     * @param modelID - Identificador del modelo abierto en web-ifc
     * @param spatialTree - Estructura espacial del modelo
     * @param elementosIfc - Elementos ya persistidos (`elementoIfcRepository.create`)
     */
    async getInfoByTableCantidad_ifc(
        modelID: number,
        spatialTree: SpatialNode,
        elementosIfc: ElementoIfcEntity[],
    ): Promise<ProcessIfcResultByTableCantidad> {
        try {
            const expressIdByGlobalId = this.buildExpressIdByGlobalIdMap(
                modelID,
                spatialTree,
            );
            const data: CantidadIfcTableData[] = [];
            const seenKeys = new Set<string>();

            for (const elemento of elementosIfc) {
                const expressID = expressIdByGlobalId.get(elemento.globalId);
                if (expressID === undefined) {
                    this.logger.warn(
                        `No se encontró expressID para cantidades del elemento id=${elemento.id} tipo=${elemento.tipoEntidadIfc}`,
                    );
                    continue;
                }

                let definitions: unknown[];
                try {
                    // getPropertySets también devuelve IfcElementQuantity;
                    // recursive=true expande Quantities / HasQuantities
                    definitions = await this.ifcApi.properties.getPropertySets(
                        modelID,
                        expressID,
                        true,
                        true,
                    );
                } catch (error) {
                    this.logger.warn(
                        `No se pudieron leer cantidades del elemento id=${elemento.id} tipo=${elemento.tipoEntidadIfc}: ${error instanceof Error ? error.message : error
                        }`,
                    );
                    continue;
                }

                for (const definition of definitions ?? []) {
                    if (!this.isElementQuantity(definition)) continue;

                    const cantidades =
                        this.extractCantidadesFromQset(definition);
                    for (const cantidad of cantidades) {
                        const key = `${elemento.id}:${cantidad.nombre_cantidad}`;
                        if (seenKeys.has(key)) continue;
                        seenKeys.add(key);

                        data.push({
                            elemento_id: elemento.id,
                            nombre_cantidad: this.truncate(
                                cantidad.nombre_cantidad,
                                150,
                            ),
                            valor: cantidad.valor,
                            unidad: cantidad.unidad
                                ? this.truncate(cantidad.unidad, 50)
                                : null,
                        });
                    }
                }
            }

            return {
                status: true,
                message: 'Datos de cantidad_ifc obtenidos correctamente',
                data,
            };
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Error desconocido';
            this.logger.error(
                `Error al obtener datos para cantidad_ifc: ${message}`,
            );
            return {
                status: false,
                message,
                data: null,
            };
        }
    }

    /**
     * True si la definición es IfcElementQuantity (QuantityTakeOff).
     */
    private isElementQuantity(definition: unknown): boolean {
        if (!definition || typeof definition !== 'object') return false;
        const record = definition as Record<string, unknown>;
        const typeName = this.resolveIfcTypeName(record);
        if (typeName === 'IFCELEMENTQUANTITY') return true;
        // Fallback: tiene array Quantities típico de Qto
        return Array.isArray(record.Quantities);
    }

    /**
     * Extrae mediciones planas de un IfcElementQuantity.
     */
    private extractCantidadesFromQset(
        qset: unknown,
    ): Array<{
        nombre_cantidad: string;
        valor: number;
        unidad: string | null;
    }> {
        if (!qset || typeof qset !== 'object') return [];
        const record = qset as Record<string, unknown>;
        const qsetName = this.readIfcString(record.Name);
        const quantities = this.asArray(record.Quantities);
        const result: Array<{
            nombre_cantidad: string;
            valor: number;
            unidad: string | null;
        }> = [];

        for (const quantity of quantities) {
            result.push(
                ...this.flattenIfcPhysicalQuantity(quantity, qsetName ?? ''),
            );
        }

        return result;
    }

    /**
     * Normaliza cantidades simples y complejas (IfcPhysicalComplexQuantity).
     */
    private flattenIfcPhysicalQuantity(
        quantity: unknown,
        namePrefix: string,
    ): Array<{
        nombre_cantidad: string;
        valor: number;
        unidad: string | null;
    }> {
        if (!quantity || typeof quantity !== 'object') return [];
        const record = quantity as Record<string, unknown>;
        const typeName = this.resolveIfcTypeName(record);
        const baseName = this.readIfcString(record.Name);
        if (!baseName) return [];

        const nombre =
            namePrefix.length > 0 ? `${namePrefix}.${baseName}` : baseName;

        if (
            typeName === 'IFCPHYSICALCOMPLEXQUANTITY' ||
            Array.isArray(record.HasQuantities)
        ) {
            const nested = this.asArray(record.HasQuantities);
            const rows: Array<{
                nombre_cantidad: string;
                valor: number;
                unidad: string | null;
            }> = [];
            for (const child of nested) {
                rows.push(...this.flattenIfcPhysicalQuantity(child, nombre));
            }
            return rows;
        }

        const valor = this.extractIfcQuantityNumericValue(record);
        if (valor === null) return [];

        return [
            {
                nombre_cantidad: nombre,
                valor,
                unidad: this.extractIfcQuantityUnit(record),
            },
        ];
    }

    /**
     * Lee el valor numérico según el tipo de cantidad IFC.
     */
    private extractIfcQuantityNumericValue(
        record: Record<string, unknown>,
    ): number | null {
        const valueFields = [
            'LengthValue',
            'AreaValue',
            'VolumeValue',
            'CountValue',
            'WeightValue',
            'TimeValue',
            'NumberValue',
        ];

        for (const field of valueFields) {
            if (!(field in record)) continue;
            const n = this.readIfcNumber(record[field]);
            if (n !== null) return n;
        }

        return null;
    }

    /**
     * Obtiene la unidad textual asociada a la cantidad (si existe).
     */
    private extractIfcQuantityUnit(
        record: Record<string, unknown>,
    ): string | null {
        const unit = record.Unit;
        if (unit == null) return null;
        if (typeof unit === 'string') {
            const trimmed = unit.trim();
            return trimmed.length > 0 ? trimmed : null;
        }
        if (typeof unit !== 'object') return null;

        const unitRecord = unit as Record<string, unknown>;
        const name =
            this.readIfcString(unitRecord.Name) ||
            this.readIfcString(unitRecord.UnitType) ||
            this.stringifyIfcValue(unitRecord.Name);

        if (!name) return null;

        const prefix = this.readIfcString(unitRecord.Prefix);
        return prefix ? `${prefix}${name}` : name;
    }

    /**
     * Recorre toda la estructura espacial y cuenta elementos por categoría (tipo IFC).
     */
    private buildCategorias(root: SpatialNode): IfcCategoriaResumen[] {
        const counts = new Map<string, number>();

        const walk = (node: SpatialNode): void => {
            if (this.isCountableElement(node.type)) {
                const label = node.type;
                counts.set(label, (counts.get(label) ?? 0) + 1);
            }
            for (const child of node.children ?? []) {
                walk(child);
            }
        };

        walk(root);

        return [...counts.entries()]
            .map(([categoria, cantidad]) => ({ categoria, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad || a.categoria.localeCompare(b.categoria));
    }

    /**
     * Agrupa por nivel (IfcBuildingStorey) los elementos contenidos
     * (incluyendo los anidados en espacios).
     */
    private buildElementosPorNivel(
        modelID: number,
        root: SpatialNode,
    ): IfcElementosPorNivel[] {
        const result: IfcElementosPorNivel[] = [];

        const visit = (node: SpatialNode): void => {
            if (this.normalizeTypeName(node.type) === 'IFCBUILDINGSTOREY') {
                const nivel = this.resolveStoreyName(modelID, node.expressID);
                const elementCounts = new Map<string, number>();

                const collect = (child: SpatialNode): void => {
                    if (this.isCountableElement(child.type)) {
                        const label = child.type;
                        elementCounts.set(
                            label,
                            (elementCounts.get(label) ?? 0) + 1,
                        );
                    }
                    for (const nested of child.children ?? []) {
                        collect(nested);
                    }
                };

                for (const child of node.children ?? []) {
                    collect(child);
                }

                result.push({
                    nivel,
                    elementos: [...elementCounts.entries()]
                        .map(([nom_elemento, cantidad]) => ({
                            nom_elemento,
                            cantidad,
                        }))
                        .sort(
                            (a, b) =>
                                b.cantidad - a.cantidad ||
                                a.nom_elemento.localeCompare(b.nom_elemento),
                        ),
                });
            }

            for (const child of node.children ?? []) {
                visit(child);
            }
        };

        visit(root);
        return result;
    }

    private isCountableElement(type: string | undefined | null): boolean {
        const normalized = this.normalizeTypeName(type);
        return Boolean(normalized) && !SPATIAL_TYPE_NAMES.has(normalized);
    }

    /**
     * Agrega materiales vía IfcRelAssociatesMaterial (capa, lista, constituyente, etc.).
     * El precio se toma de propiedades Cost/UnitCost del material si existen; si no, 0.
     */
    private buildMateriales(modelID: number): IfcMaterialResumen[] {
        const counts = new Map<string, { cantidad: number; precio: number }>();
        const relIds = this.ifcApi.GetLineIDsWithType(
            modelID,
            IFCRELASSOCIATESMATERIAL,
        );

        for (let i = 0; i < relIds.size(); i++) {
            const relId = relIds.get(i);
            if (relId <= 0) continue;

            let rel: Record<string, unknown>;
            try {
                rel = this.ifcApi.GetLine(modelID, relId, false) as Record<
                    string,
                    unknown
                >;
            } catch {
                continue;
            }

            const related = this.asArray(rel.RelatedObjects);
            const relatedCount = related.length > 0 ? related.length : 1;
            const materialId = this.extractExpressId(rel.RelatingMaterial);
            if (materialId === null) continue;

            const materials = this.resolveMaterialEntries(modelID, materialId);
            for (const { name, precio } of materials) {
                const current = counts.get(name) ?? { cantidad: 0, precio: 0 };
                current.cantidad += relatedCount;
                if (precio > 0 && current.precio === 0) {
                    current.precio = precio;
                }
                counts.set(name, current);
            }
        }

        return [...counts.entries()]
            .map(([material, { cantidad, precio }]) => ({
                material,
                cantidad,
                precio,
            }))
            .sort(
                (a, b) =>
                    b.cantidad - a.cantidad ||
                    a.material.localeCompare(b.material),
            );
    }

    /**
     * Resuelve nombres de material desde cualquier definición IFC
     * (IfcMaterial, LayerSet, LayerSetUsage, List, ConstituentSet).
     */
    private resolveMaterialEntries(
        modelID: number,
        expressID: number,
        seen = new Set<number>(),
    ): Array<{ name: string; precio: number }> {
        if (expressID <= 0 || seen.has(expressID)) return [];
        seen.add(expressID);

        let line: Record<string, unknown>;
        try {
            line = this.ifcApi.GetLine(modelID, expressID, false) as Record<
                string,
                unknown
            >;
        } catch {
            return [];
        }

        const typeCode = line.type as number;
        const typeName = this.normalizeTypeName(
            this.ifcApi.GetNameFromTypeCode(typeCode),
        );
        const results: Array<{ name: string; precio: number }> = [];

        switch (typeName) {
            case 'IFCMATERIAL': {
                const rawName = this.readIfcString(line.Name);
                const name =
                    rawName && rawName !== '<Unnamed>'
                        ? rawName
                        : `Material_${expressID}`;
                results.push({
                    name,
                    precio: this.extractPriceFromLine(line),
                });
                break;
            }
            case 'IFCMATERIALLIST': {
                for (const ref of this.asArray(line.Materials)) {
                    const id = this.extractExpressId(ref);
                    if (id !== null) {
                        results.push(
                            ...this.resolveMaterialEntries(modelID, id, seen),
                        );
                    }
                }
                break;
            }
            case 'IFCMATERIALLAYERSETUSAGE': {
                const layerSetId = this.extractExpressId(line.ForLayerSet);
                if (layerSetId !== null) {
                    results.push(
                        ...this.resolveMaterialEntries(
                            modelID,
                            layerSetId,
                            seen,
                        ),
                    );
                }
                break;
            }
            case 'IFCMATERIALLAYERSET': {
                for (const ref of this.asArray(line.MaterialLayers)) {
                    const layerId = this.extractExpressId(ref);
                    if (layerId === null) continue;
                    results.push(
                        ...this.resolveMaterialEntries(modelID, layerId, seen),
                    );
                }
                break;
            }
            case 'IFCMATERIALLAYER': {
                const matId = this.extractExpressId(line.Material);
                if (matId !== null) {
                    results.push(
                        ...this.resolveMaterialEntries(modelID, matId, seen),
                    );
                } else {
                    const layerName = this.readIfcString(line.Name);
                    if (layerName) {
                        results.push({ name: layerName, precio: 0 });
                    }
                }
                break;
            }
            case 'IFCMATERIALCONSTITUENTSET': {
                for (const ref of this.asArray(line.MaterialConstituents)) {
                    const id = this.extractExpressId(ref);
                    if (id !== null) {
                        results.push(
                            ...this.resolveMaterialEntries(modelID, id, seen),
                        );
                    }
                }
                break;
            }
            case 'IFCMATERIALCONSTITUENT': {
                const matId = this.extractExpressId(line.Material);
                if (matId !== null) {
                    results.push(
                        ...this.resolveMaterialEntries(modelID, matId, seen),
                    );
                } else {
                    const constituentName = this.readIfcString(line.Name);
                    if (constituentName) {
                        results.push({ name: constituentName, precio: 0 });
                    }
                }
                break;
            }
            case 'IFCMATERIALPROFILESETUSAGE': {
                const profileSetId = this.extractExpressId(
                    line.ForProfileSet,
                );
                if (profileSetId !== null) {
                    results.push(
                        ...this.resolveMaterialEntries(
                            modelID,
                            profileSetId,
                            seen,
                        ),
                    );
                }
                break;
            }
            case 'IFCMATERIALPROFILESET': {
                for (const ref of this.asArray(line.MaterialProfiles)) {
                    const id = this.extractExpressId(ref);
                    if (id !== null) {
                        results.push(
                            ...this.resolveMaterialEntries(modelID, id, seen),
                        );
                    }
                }
                break;
            }
            case 'IFCMATERIALPROFILE': {
                const matId = this.extractExpressId(line.Material);
                if (matId !== null) {
                    results.push(
                        ...this.resolveMaterialEntries(modelID, matId, seen),
                    );
                }
                break;
            }
            default: {
                // Fallback: si tiene Name usable, usarlo
                const fallback = this.readIfcString(line.Name);
                if (fallback && fallback !== '<Unnamed>') {
                    results.push({ name: fallback, precio: 0 });
                }
            }
        }

        // Deduplicar por nombre dentro de la misma definición
        const unique = new Map<string, { name: string; precio: number }>();
        for (const entry of results) {
            if (!unique.has(entry.name)) {
                unique.set(entry.name, entry);
            }
        }
        return [...unique.values()];
    }

    private resolveStoreyName(
        modelID: number,
        expressID: number,
    ): string | number {
        try {
            const line = this.ifcApi.GetLine(modelID, expressID, false) as Record<
                string,
                unknown
            >;
            const name =
                this.readIfcString(line.Name) ||
                this.readIfcString(line.LongName);
            if (name) return name;
        } catch {
            // fallback abajo
        }
        return expressID;
    }

    /**
     * Intenta leer Cost / UnitCost / NominalCost si vienen embebidos en la línea.
     * La mayoría de IFC no traen precio; en ese caso retorna 0.
     */
    private extractPriceFromLine(line: Record<string, unknown>): number {
        const candidates = [
            line.Cost,
            line.UnitCost,
            line.NominalCost,
            line.precio,
            line.Price,
        ];
        for (const candidate of candidates) {
            const n = this.readIfcNumber(candidate);
            if (n !== null && Number.isFinite(n)) return n;
        }
        return 0;
    }

    private normalizeTypeName(type: string | undefined | null): string {
        if (!type) return '';
        return type.trim().toUpperCase();
    }

    private readIfcString(value: unknown): string | null {
        if (typeof value === 'string') {
            const trimmed = value.trim();
            return trimmed.length > 0 ? trimmed : null;
        }
        if (
            value &&
            typeof value === 'object' &&
            'value' in value &&
            typeof (value as { value: unknown }).value === 'string'
        ) {
            const trimmed = (
                (value as { value: string }).value || ''
            ).trim();
            return trimmed.length > 0 ? trimmed : null;
        }
        return null;
    }

    private readIfcNumber(value: unknown): number | null {
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        if (
            value &&
            typeof value === 'object' &&
            'value' in value &&
            typeof (value as { value: unknown }).value === 'number'
        ) {
            const n = (value as { value: number }).value;
            return Number.isFinite(n) ? n : null;
        }
        return null;
    }

    private extractExpressId(ref: unknown): number | null {
        if (typeof ref === 'number' && ref > 0) return ref;
        if (
            ref &&
            typeof ref === 'object' &&
            'value' in ref &&
            typeof (ref as { value: unknown }).value === 'number'
        ) {
            const id = (ref as { value: number }).value;
            return id > 0 ? id : null;
        }
        if (
            ref &&
            typeof ref === 'object' &&
            'expressID' in ref &&
            typeof (ref as { expressID: unknown }).expressID === 'number'
        ) {
            const id = (ref as { expressID: number }).expressID;
            return id > 0 ? id : null;
        }
        return null;
    }

    private asArray(value: unknown): unknown[] {
        if (value == null) return [];
        return Array.isArray(value) ? value : [value];
    }
}
