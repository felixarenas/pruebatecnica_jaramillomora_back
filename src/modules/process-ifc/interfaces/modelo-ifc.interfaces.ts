import { ModeloIfcEntity } from '../entities/modelo-ifc.entity';

export type CreateModeloIfcData = {
  nombre_archivo: string;
  esquema_ifc: string;
  fecha_procesado?: Date | null;
  aplicacion_creadora?: string | null;
  totales_elementos?: number | null;
};

export abstract class ModeloIfcRepository {
  abstract create(data: CreateModeloIfcData): Promise<ModeloIfcEntity>;
  abstract findById(id: number): Promise<ModeloIfcEntity | null>;
  abstract findByName(name: string): Promise<ModeloIfcEntity | null>;
}
