import { PropertySetIfcEntity } from '../entities/property-set-ifc.entity';

export type CreatePropertySetIfcData = {
  elemento_id: number;
  nombre_pset: string;
};

export abstract class PropertySetIfcRepository {
  abstract create(
    data: CreatePropertySetIfcData[],
  ): Promise<PropertySetIfcEntity[]>;
  abstract findById(id: number): Promise<PropertySetIfcEntity | null>;
  abstract findByElementoId(
    elementoId: number,
  ): Promise<PropertySetIfcEntity[]>;
}
