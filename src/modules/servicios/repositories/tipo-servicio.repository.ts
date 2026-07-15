import { Injectable } from '@nestjs/common';
import { tipo_servicios } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { handleError } from 'src/core/config/handleError';
import { TipoServicioEntity } from '../entities/tipo-servicio.entity';
import { TipoServicioRepository } from '../interfaces/tipo-servicio.interfaces';

@Injectable()
export class PrismaTipoServicioRepository implements TipoServicioRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<TipoServicioEntity[]> {
        try {
            const models = await this.prisma.tipo_servicios.findMany({
                orderBy: { id: 'asc' },
            });

            return models.map((model) => this.mapToEntity(model));
        } catch (error) {
            throw handleError(error);
        }
    }

    private mapToEntity(model: tipo_servicios): TipoServicioEntity {
        return new TipoServicioEntity(model.id, model.nombre);
    }
}
