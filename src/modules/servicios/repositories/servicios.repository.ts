import { Injectable } from '@nestjs/common';
import { Prisma, servicios } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { handleError } from 'src/core/config/handleError';
import { ServicioEntity } from '../entities/servicio.entity';
import { ServicioListEntity } from '../entities/servicio-list.entity';
import {
    ServicioByClienteItemEntity,
    ServiciosByClienteEntity,
} from '../entities/servicios-by-cliente.entity';
import {
    ServicioRepository,
    CreateServicioData,
    UpdateServicioData,
} from '../interfaces/servicios.interfaces';

type ServicioWithRelations = Prisma.serviciosGetPayload<{
    include: {
        clientes: { select: { nombres: true; apellidos: true } };
        tipo_servicios: { select: { nombre: true } };
    };
}>;

type ClienteWithServicios = Prisma.clientesGetPayload<{
    include: {
        identity_type: { select: { name: true } };
        servicios: {
            include: {
                tipo_servicios: { select: { nombre: true } };
            };
        };
    };
}>;

@Injectable()
export class PrismaServicioRepository implements ServicioRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<ServicioListEntity[]> {
        try {
            const models = await this.prisma.servicios.findMany({
                include: {
                    clientes: {
                        select: {
                            nombres: true,
                            apellidos: true,
                        },
                    },
                    tipo_servicios: {
                        select: {
                            nombre: true,
                        },
                    },
                },
                orderBy: { id: 'asc' },
            });

            return models.map((model) => this.mapToListEntity(model));
        } catch (error) {
            throw handleError(error);
        }
    }

    async findById(id: number): Promise<ServicioEntity | null> {
        try {
            const model = await this.prisma.servicios.findUnique({ where: { id } });
            if (!model) return null;

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async findByIdCliente(id_cliente: number): Promise<ServicioEntity[]> {
        try {
            const models = await this.prisma.servicios.findMany({
                where: { id_cliente },
                orderBy: { id: 'asc' },
            });

            return models.map((model) => this.mapToEntity(model));
        } catch (error) {
            throw handleError(error);
        }
    }

    async findByClienteIdentificacion(
        id_tipo_identificacion: number,
        identificacion: number,
    ): Promise<ServiciosByClienteEntity | null> {
        try {
            const model = await this.prisma.clientes.findFirst({
                where: {
                    id_tipo_identificacion,
                    identificacion,
                },
                include: {
                    identity_type: {
                        select: { name: true },
                    },
                    servicios: {
                        include: {
                            tipo_servicios: {
                                select: { nombre: true },
                            },
                        },
                        orderBy: { id: 'asc' },
                    },
                },
            });

            if (!model) return null;

            return this.mapToServiciosByClienteEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async findActiveByClienteAndTipo(
        id_cliente: number,
        id_tipo_servicio: number,
    ): Promise<ServicioEntity | null> {
        try {
            const model = await this.prisma.servicios.findFirst({
                where: {
                    id_cliente,
                    id_tipo_servicio,
                    estado: true,
                },
            });
            if (!model) return null;

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async create(data: CreateServicioData): Promise<ServicioEntity> {
        try {
            const model = await this.prisma.servicios.create({
                data: {
                    id_cliente: data.id_cliente,
                    id_tipo_servicio: data.id_tipo_servicio,
                    fecha_inicio: data.fecha_inicio,
                    ultima_facturacion: data.ultima_facturacion,
                    ultimo_pago: data.ultimo_pago,
                },
            });

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async update(id: number, data: UpdateServicioData): Promise<ServicioEntity> {
        try {
            const model = await this.prisma.servicios.update({
                where: { id },
                data: {
                    ...(data.id_tipo_servicio !== undefined && {
                        id_tipo_servicio: data.id_tipo_servicio,
                    }),
                    ...(data.fecha_inicio !== undefined && {
                        fecha_inicio: data.fecha_inicio,
                    }),
                },
            });

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async softDelete(id: number): Promise<ServicioEntity> {
        try {
            const model = await this.prisma.servicios.update({
                where: { id },
                data: { estado: false },
            });

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    private mapToEntity(model: servicios): ServicioEntity {
        return new ServicioEntity(
            model.id,
            model.id_cliente,
            model.id_tipo_servicio,
            model.fecha_inicio,
            model.ultima_facturacion,
            model.ultimo_pago,
            model.estado,
        );
    }

    private mapToListEntity(model: ServicioWithRelations): ServicioListEntity {
        return new ServicioListEntity(
            model.id,
            model.id_cliente,
            `${model.clientes.nombres} ${model.clientes.apellidos}`.trim(),
            model.id_tipo_servicio,
            model.tipo_servicios.nombre,
            model.fecha_inicio,
            model.ultima_facturacion,
            model.ultimo_pago,
            model.estado,
        );
    }

    private mapToServiciosByClienteEntity(
        model: ClienteWithServicios,
    ): ServiciosByClienteEntity {
        return new ServiciosByClienteEntity(
            model.id,
            `${model.nombres} ${model.apellidos}`.trim(),
            model.identity_type.name,
            model.identificacion,
            model.servicios.map(
                (servicio) =>
                    new ServicioByClienteItemEntity(
                        servicio.id,
                        servicio.tipo_servicios.nombre,
                        servicio.fecha_inicio,
                        servicio.ultima_facturacion,
                        servicio.ultimo_pago,
                        servicio.estado,
                    ),
            ),
        );
    }
}
