/**
 * Payload para procesar el archivo IFC por ruta absoluta.
 */
export interface IfcProcessPayload {
  /** Ruta del archivo con nombre incluyendo extensión */
  filePath: string;
}

export interface IfcProcessByNamePayload {
  /** Nombre del archivo con su extensión */
  nom_file: string;
}

/** Resumen de elementos por categoría IFC */
export interface IfcCategoriaResumen {
  categoria: string;
  cantidad: number;
}

/** Resumen de un tipo de elemento dentro de un nivel */
export interface IfcElementoEnNivel {
  nom_elemento: string;
  cantidad: number;
}

/** Elementos agrupados por nivel (IfcBuildingStorey) */
export interface IfcElementosPorNivel {
  nivel: string | number;
  elementos: IfcElementoEnNivel[];
}

/** Material utilizado en el modelo */
export interface IfcMaterialResumen {
  material: string;
  cantidad: number;
  /** Precio unitario si existe en el IFC; 0 si no está definido */
  precio: number;
}

/** Datos agregados del procesamiento IFC */
export interface IfcProcessedData {
  modelID: number;
  categorias: IfcCategoriaResumen[];
  elementosPorNivel: IfcElementosPorNivel[];
  materiales: IfcMaterialResumen[];
}

/**
 * Resultado del procesado del archivo IFC.
 */
export interface ProcessIfcResult {
  /** Estado de la petición */
  status: boolean;
  /** Mensaje de la petición */
  message: string;
  /** Datos agregados del modelo (vacío `{}` en error) */
  data: IfcProcessedData | Record<string, never>;
}

/** Datos listos para insertar en la tabla `modelo_ifc` */
export interface ModeloIfcTableData {
  nombre_archivo: string;
  esquema_ifc: string;
  fecha_procesado: Date;
  aplicacion_creadora: string | null;
  totales_elementos: number;
}

/** Datos listos para insertar en la tabla `agrupacion_ifc` */
export interface AgrupacionIfcTableData {
  modelo_id: number;
  tipo_agrupacion: string;
  nombre: string;
  global_id_ifc: string | null;
}

/** Datos listos para insertar en la tabla `elemento_ifc` */
export interface ElementoIfcTableData {
  modelo_id: number;
  agrupacion_id: number;
  global_id: string;
  tipo_entidad_ifc: string;
  nombre: string | null;
  etiqueta_id: string | null;
}

/** Datos listos para insertar en la tabla `property_set` */
export interface PropertySetIfcTableData {
  elemento_id: number;
  nombre_pset: string;
}

/** Datos listos para insertar en la tabla `propiedad_parametro` */
export interface PropiedadParametroTableData {
  pset_id: number;
  nombre_propiedad: string;
  valor: string | null;
  tipo_valor: string | null;
}

/** Datos listos para insertar en la tabla `cantidad_ifc` */
export interface CantidadIfcTableData {
  elemento_id: number;
  nombre_cantidad: string;
  valor: number;
  unidad: string | null;
}

/** Resultado del procesado del archivo IFC para almacenar en la base de datos */
export interface ProcessIfcResultByTableModelo {
  /** Estado de la petición */
  status: boolean;
  /** Mensaje de la petición */
  message: string;
  /** Datos del modelo IFC (null en error) */
  data: ModeloIfcTableData | null;
}

/** Resultado de extracción de agrupaciones espaciales para `agrupacion_ifc` */
export interface ProcessIfcResultByTableAgrupacion {
  /** Estado de la petición */
  status: boolean;
  /** Mensaje de la petición */
  message: string;
  /** Filas listas para persistir (null en error) */
  data: AgrupacionIfcTableData[] | null;
}

/** Resultado de extracción de elementos para `elemento_ifc` */
export interface ProcessIfcResultByTableElemento {
  /** Estado de la petición */
  status: boolean;
  /** Mensaje de la petición */
  message: string;
  /** Filas listas para persistir (null en error) */
  data: ElementoIfcTableData[] | null;
}

/** Resultado de extracción de property sets para `property_set` */
export interface ProcessIfcResultByTablePropertySet {
  /** Estado de la petición */
  status: boolean;
  /** Mensaje de la petición */
  message: string;
  /** Filas listas para persistir (null en error) */
  data: PropertySetIfcTableData[] | null;
}

/** Resultado de extracción de propiedades/parámetros para `propiedad_parametro` */
export interface ProcessIfcResultByTablePropiedadParametro {
  /** Estado de la petición */
  status: boolean;
  /** Mensaje de la petición */
  message: string;
  /** Filas listas para persistir (null en error) */
  data: PropiedadParametroTableData[] | null;
}

/** Resultado de extracción de cantidades físicas para `cantidad_ifc` */
export interface ProcessIfcResultByTableCantidad {
  /** Estado de la petición */
  status: boolean;
  /** Mensaje de la petición */
  message: string;
  /** Filas listas para persistir (null en error) */
  data: CantidadIfcTableData[] | null;
}
