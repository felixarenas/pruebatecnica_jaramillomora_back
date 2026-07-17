import { ElementoIfcEntity } from '../entities/elemento-ifc.entity';

export type CreateElementoIfcData = {
  modelo_id: number;
  agrupacion_id: number;
  global_id: string;
  tipo_entidad_ifc: string;
  nombre?: string | null;
  etiqueta_id?: string | null;
};

export abstract class ElementoIfcRepository {
  abstract create(
    data: CreateElementoIfcData[],
  ): Promise<ElementoIfcEntity[]>;
  abstract findById(id: number): Promise<ElementoIfcEntity | null>;
  abstract findByModeloId(modeloId: number): Promise<ElementoIfcEntity[]>;
  abstract findByAgrupacionId(
    agrupacionId: number,
  ): Promise<ElementoIfcEntity[]>;
}
