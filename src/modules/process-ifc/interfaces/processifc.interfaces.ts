import { RefFileEntity } from '../entities/ref-file.entity';

export type CreateRefFileData = {
  rutaCompleta: string;
  nombreArchivo: string;
};

export abstract class ProcessIfcRepository {
  abstract create(data: CreateRefFileData): Promise<RefFileEntity>;
  abstract findAll(): Promise<RefFileEntity[]>;
  abstract getElementsDBByIfcProcessNivel(id_process: number): Promise<any>;
  abstract getElementsDBByIfcProcessCategory(id_process: number): Promise<any>;
}
