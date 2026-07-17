import { CantidadIfcEntity } from '../entities/cantidad-ifc.entity';

export type CreateCantidadIfcData = {
  elemento_id: number;
  nombre_cantidad: string;
  valor: number;
  unidad: string | null;
};

export abstract class CantidadIfcRepository {
  abstract create(
    data: CreateCantidadIfcData[],
  ): Promise<CantidadIfcEntity[]>;
  abstract findById(id: number): Promise<CantidadIfcEntity | null>;
  abstract findByElementoId(
    elementoId: number,
  ): Promise<CantidadIfcEntity[]>;
}
