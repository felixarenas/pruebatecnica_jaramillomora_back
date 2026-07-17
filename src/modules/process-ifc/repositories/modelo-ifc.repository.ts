import { Injectable } from '@nestjs/common';
import { modelo_ifc } from '@prisma/client';
import { handleError } from 'src/core/config/handleError';
import { PrismaService } from 'src/core/database/prisma.service';
import { ModeloIfcEntity } from '../entities/modelo-ifc.entity';
import {
  CreateModeloIfcData,
  ModeloIfcRepository,
} from '../interfaces/modelo-ifc.interfaces';

@Injectable()
export class PrismaModeloIfcRepository implements ModeloIfcRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateModeloIfcData): Promise<ModeloIfcEntity> {
    try {
      const model = await this.prisma.modelo_ifc.create({
        data: {
          nombre_archivo: data.nombre_archivo,
          esquema_ifc: data.esquema_ifc,
          fecha_procesado: data.fecha_procesado ?? new Date(),
          aplicacion_creadora: data.aplicacion_creadora ?? null,
          totales_elementos: data.totales_elementos ?? 0,
        },
      });

      return this.mapToEntity(model);
    } catch (error) {
      throw handleError(error);
    }
  }

  async findById(id: number): Promise<ModeloIfcEntity | null> {
    try {
      const model = await this.prisma.modelo_ifc.findUnique({ where: { id } });
      if (!model) return null;

      return this.mapToEntity(model);
    } catch (error) {
      throw handleError(error);
    }
  }

  async findByName(name: string): Promise<ModeloIfcEntity | null> {
    try {
      const model = await this.prisma.modelo_ifc.findUnique({ where: { nombre_archivo: name } });
      if (!model) return null;

      return this.mapToEntity(model);
    } catch (error) {
      throw handleError(error);
    }
  }

  private mapToEntity(model: modelo_ifc): ModeloIfcEntity {
    return new ModeloIfcEntity(
      model.id,
      model.nombre_archivo,
      model.esquema_ifc,
      model.fecha_procesado,
      model.aplicacion_creadora,
      model.totales_elementos,
    );
  }
}
