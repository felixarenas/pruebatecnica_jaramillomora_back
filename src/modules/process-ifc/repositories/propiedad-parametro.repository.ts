import { Injectable } from '@nestjs/common';
import { propiedad_parametro } from '@prisma/client';
import { handleError } from 'src/core/config/handleError';
import { PrismaService } from 'src/core/database/prisma.service';
import { PropiedadParametroEntity } from '../entities/propiedad-parametro.entity';
import {
  CreatePropiedadParametroData,
  PropiedadParametroRepository,
} from '../interfaces/propiedad-parametro.interfaces';

@Injectable()
export class PrismaPropiedadParametroRepository
  implements PropiedadParametroRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreatePropiedadParametroData[],
  ): Promise<PropiedadParametroEntity[]> {
    try {
      if (data.length === 0) {
        return [];
      }

      const models = await this.prisma.propiedad_parametro.createManyAndReturn({
        data: data.map((item) => ({
          pset_id: item.pset_id,
          nombre_propiedad: item.nombre_propiedad,
          valor: item.valor,
          tipo_valor: item.tipo_valor,
        })),
      });

      return models.map((model) => this.mapToEntity(model));
    } catch (error) {
      throw handleError(error);
    }
  }

  async findById(id: number): Promise<PropiedadParametroEntity | null> {
    try {
      const model = await this.prisma.propiedad_parametro.findUnique({
        where: { id },
      });
      if (!model) return null;

      return this.mapToEntity(model);
    } catch (error) {
      throw handleError(error);
    }
  }

  async findByPsetId(psetId: number): Promise<PropiedadParametroEntity[]> {
    try {
      const models = await this.prisma.propiedad_parametro.findMany({
        where: { pset_id: psetId },
        orderBy: { id: 'asc' },
      });

      return models.map((model) => this.mapToEntity(model));
    } catch (error) {
      throw handleError(error);
    }
  }

  private mapToEntity(model: propiedad_parametro): PropiedadParametroEntity {
    return new PropiedadParametroEntity(
      model.id,
      model.pset_id,
      model.nombre_propiedad,
      model.valor,
      model.tipo_valor,
    );
  }
}
