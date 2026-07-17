import { Injectable } from '@nestjs/common';
import { cantidad_ifc, Prisma } from '@prisma/client';
import { handleError } from 'src/core/config/handleError';
import { PrismaService } from 'src/core/database/prisma.service';
import { CantidadIfcEntity } from '../entities/cantidad-ifc.entity';
import {
  CantidadIfcRepository,
  CreateCantidadIfcData,
} from '../interfaces/cantidad-ifc.interfaces';

@Injectable()
export class PrismaCantidadIfcRepository implements CantidadIfcRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCantidadIfcData[]): Promise<CantidadIfcEntity[]> {
    try {
      if (data.length === 0) {
        return [];
      }

      const models = await this.prisma.cantidad_ifc.createManyAndReturn({
        data: data.map((item) => ({
          elemento_id: item.elemento_id,
          nombre_cantidad: item.nombre_cantidad,
          valor: new Prisma.Decimal(item.valor),
          unidad: item.unidad,
        })),
      });

      return models.map((model) => this.mapToEntity(model));
    } catch (error) {
      throw handleError(error);
    }
  }

  async findById(id: number): Promise<CantidadIfcEntity | null> {
    try {
      const model = await this.prisma.cantidad_ifc.findUnique({
        where: { id },
      });
      if (!model) return null;

      return this.mapToEntity(model);
    } catch (error) {
      throw handleError(error);
    }
  }

  async findByElementoId(elementoId: number): Promise<CantidadIfcEntity[]> {
    try {
      const models = await this.prisma.cantidad_ifc.findMany({
        where: { elemento_id: elementoId },
        orderBy: { id: 'asc' },
      });

      return models.map((model) => this.mapToEntity(model));
    } catch (error) {
      throw handleError(error);
    }
  }

  private mapToEntity(model: cantidad_ifc): CantidadIfcEntity {
    return new CantidadIfcEntity(
      model.id,
      model.elemento_id,
      model.nombre_cantidad,
      model.valor.toNumber(),
      model.unidad,
    );
  }
}
