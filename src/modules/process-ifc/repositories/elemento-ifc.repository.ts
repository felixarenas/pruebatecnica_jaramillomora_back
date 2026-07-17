import { Injectable } from '@nestjs/common';
import { elemento_ifc } from '@prisma/client';
import { handleError } from 'src/core/config/handleError';
import { PrismaService } from 'src/core/database/prisma.service';
import { ElementoIfcEntity } from '../entities/elemento-ifc.entity';
import {
  CreateElementoIfcData,
  ElementoIfcRepository,
} from '../interfaces/elemento-ifc.interfaces';

@Injectable()
export class PrismaElementoIfcRepository implements ElementoIfcRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateElementoIfcData[]): Promise<ElementoIfcEntity[]> {
    try {
      if (data.length === 0) {
        return [];
      }

      const models = await this.prisma.elemento_ifc.createManyAndReturn({
        data: data.map((item) => ({
          modelo_id: item.modelo_id,
          agrupacion_id: item.agrupacion_id,
          global_id: item.global_id,
          tipo_entidad_ifc: item.tipo_entidad_ifc,
          nombre: item.nombre ?? null,
          etiqueta_id: item.etiqueta_id ?? null,
        })),
      });

      return models.map((model) => this.mapToEntity(model));
    } catch (error) {
      throw handleError(error);
    }
  }

  async findById(id: number): Promise<ElementoIfcEntity | null> {
    try {
      const model = await this.prisma.elemento_ifc.findUnique({
        where: { id },
      });
      if (!model) return null;

      return this.mapToEntity(model);
    } catch (error) {
      throw handleError(error);
    }
  }

  async findByModeloId(modeloId: number): Promise<ElementoIfcEntity[]> {
    try {
      const models = await this.prisma.elemento_ifc.findMany({
        where: { modelo_id: modeloId },
        orderBy: { id: 'asc' },
      });

      return models.map((model) => this.mapToEntity(model));
    } catch (error) {
      throw handleError(error);
    }
  }

  async findByAgrupacionId(
    agrupacionId: number,
  ): Promise<ElementoIfcEntity[]> {
    try {
      const models = await this.prisma.elemento_ifc.findMany({
        where: { agrupacion_id: agrupacionId },
        orderBy: { id: 'asc' },
      });

      return models.map((model) => this.mapToEntity(model));
    } catch (error) {
      throw handleError(error);
    }
  }

  private mapToEntity(model: elemento_ifc): ElementoIfcEntity {
    return new ElementoIfcEntity(
      model.id,
      model.modelo_id,
      model.agrupacion_id,
      model.global_id,
      model.tipo_entidad_ifc,
      model.nombre,
      model.etiqueta_id,
    );
  }
}
