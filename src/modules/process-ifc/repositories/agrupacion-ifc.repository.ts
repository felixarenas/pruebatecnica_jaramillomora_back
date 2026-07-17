import { Injectable } from '@nestjs/common';
import { agrupacion_ifc } from '@prisma/client';
import { handleError } from 'src/core/config/handleError';
import { PrismaService } from 'src/core/database/prisma.service';
import { AgrupacionIfcEntity } from '../entities/agrupacion-ifc.entity';
import {
  AgrupacionIfcRepository,
  CreateAgrupacionIfcData,
} from '../interfaces/agrupacion-ifc.interfaces';

@Injectable()
export class PrismaAgrupacionIfcRepository implements AgrupacionIfcRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateAgrupacionIfcData[],
  ): Promise<AgrupacionIfcEntity[]> {
    try {
      if (data.length === 0) {
        return [];
      }

      const models = await this.prisma.agrupacion_ifc.createManyAndReturn({
        data: data.map((item) => ({
          modelo_id: item.modelo_id,
          tipo_agrupacion: item.tipo_agrupacion,
          nombre: item.nombre,
          global_id_ifc: item.global_id_ifc ?? null,
        })),
      });

      return models.map((model) => this.mapToEntity(model));
    } catch (error) {
      throw handleError(error);
    }
  }

  async findById(id: number): Promise<AgrupacionIfcEntity | null> {
    try {
      const model = await this.prisma.agrupacion_ifc.findUnique({
        where: { id },
      });
      if (!model) return null;

      return this.mapToEntity(model);
    } catch (error) {
      throw handleError(error);
    }
  }

  async findByModeloId(modeloId: number): Promise<AgrupacionIfcEntity[]> {
    try {
      const models = await this.prisma.agrupacion_ifc.findMany({
        where: { modelo_id: modeloId },
        orderBy: { id: 'asc' },
      });

      return models.map((model) => this.mapToEntity(model));
    } catch (error) {
      throw handleError(error);
    }
  }

  private mapToEntity(model: agrupacion_ifc): AgrupacionIfcEntity {
    return new AgrupacionIfcEntity(
      model.id,
      model.modelo_id,
      model.tipo_agrupacion,
      model.nombre,
      model.global_id_ifc,
    );
  }
}
