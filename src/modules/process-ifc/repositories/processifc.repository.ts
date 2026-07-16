import { Injectable } from '@nestjs/common';
import { ref_files } from '@prisma/client';
import { handleError } from 'src/core/config/handleError';
import { PrismaService } from 'src/core/database/prisma.service';
import { RefFileEntity } from '../entities/ref-file.entity';
import {
  CreateRefFileData,
  ProcessIfcRepository,
} from '../interfaces/processifc.interfaces';

@Injectable()
export class PrismaProcessIfcRepository implements ProcessIfcRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateRefFileData): Promise<RefFileEntity> {
    try {
      const model = await this.prisma.ref_files.create({
        data: {
          nom_file: data.nombreArchivo,
          path_storage: data.rutaCompleta,
        },
      });

      return this.mapToEntity(model);
    } catch (error) {
      throw handleError(error);
    }
  }

  async findAll(): Promise<RefFileEntity[]> {
    try {
      const models = await this.prisma.ref_files.findMany({
        orderBy: { id: 'asc' },
      });

      return models.map((model) => this.mapToEntity(model));
    } catch (error) {
      throw handleError(error);
    }
  }

  private mapToEntity(model: ref_files): RefFileEntity {
    return new RefFileEntity(model.id, model.nom_file, model.path_storage);
  }
}
