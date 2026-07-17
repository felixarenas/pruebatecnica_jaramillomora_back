import { Injectable } from '@nestjs/common';
import { property_set } from '@prisma/client';
import { handleError } from 'src/core/config/handleError';
import { PrismaService } from 'src/core/database/prisma.service';
import { PropertySetIfcEntity } from '../entities/property-set-ifc.entity';
import {
  CreatePropertySetIfcData,
  PropertySetIfcRepository,
} from '../interfaces/property-set-ifc.interfaces';

@Injectable()
export class PrismaPropertySetIfcRepository
  implements PropertySetIfcRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreatePropertySetIfcData[],
  ): Promise<PropertySetIfcEntity[]> {
    try {
      if (data.length === 0) {
        return [];
      }

      const models = await this.prisma.property_set.createManyAndReturn({
        data: data.map((item) => ({
          elemento_id: item.elemento_id,
          nombre_pset: item.nombre_pset,
        })),
      });

      return models.map((model) => this.mapToEntity(model));
    } catch (error) {
      throw handleError(error);
    }
  }

  async findById(id: number): Promise<PropertySetIfcEntity | null> {
    try {
      const model = await this.prisma.property_set.findUnique({
        where: { id },
      });
      if (!model) return null;

      return this.mapToEntity(model);
    } catch (error) {
      throw handleError(error);
    }
  }

  async findByElementoId(
    elementoId: number,
  ): Promise<PropertySetIfcEntity[]> {
    try {
      const models = await this.prisma.property_set.findMany({
        where: { elemento_id: elementoId },
        orderBy: { id: 'asc' },
      });

      return models.map((model) => this.mapToEntity(model));
    } catch (error) {
      throw handleError(error);
    }
  }

  private mapToEntity(model: property_set): PropertySetIfcEntity {
    return new PropertySetIfcEntity(
      model.id,
      model.elemento_id,
      model.nombre_pset,
    );
  }
}
