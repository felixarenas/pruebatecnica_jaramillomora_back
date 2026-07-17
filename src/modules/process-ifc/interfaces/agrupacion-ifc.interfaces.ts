import { AgrupacionIfcEntity } from '../entities/agrupacion-ifc.entity';

export type CreateAgrupacionIfcData = {
  modelo_id: number;
  tipo_agrupacion: string;
  nombre: string;
  global_id_ifc?: string | null;
};

export abstract class AgrupacionIfcRepository {
  abstract create(
    data: CreateAgrupacionIfcData[],
  ): Promise<AgrupacionIfcEntity[]>;
  abstract findById(id: number): Promise<AgrupacionIfcEntity | null>;
  abstract findByModeloId(modeloId: number): Promise<AgrupacionIfcEntity[]>;
}
