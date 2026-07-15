import { Injectable } from '@nestjs/common';
import { clientes } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { handleError } from 'src/core/config/handleError';
import { ClienteEntity } from '../entities/cliente.entity';
import {
    ClienteRepository,
    CreateClienteData,
    UpdateClienteData,
} from '../interfaces/clientes.interfaces';

@Injectable()
export class PrismaClienteRepository implements ClienteRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<ClienteEntity[]> {
        try {
            const models = await this.prisma.clientes.findMany({
                orderBy: { id: 'asc' },
            });

            return models.map((model) => this.mapToEntity(model));
        } catch (error) {
            throw handleError(error);
        }
    }

    async findById(id: number): Promise<ClienteEntity | null> {
        try {
            const model = await this.prisma.clientes.findUnique({ where: { id } });
            if (!model) return null;

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async findByIdentificacion(identificacion: number): Promise<ClienteEntity | null> {
        try {
            const model = await this.prisma.clientes.findUnique({
                where: { identificacion },
            });
            if (!model) return null;

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async findByEmail(email: string): Promise<ClienteEntity | null> {
        try {
            const model = await this.prisma.clientes.findUnique({ where: { email } });
            if (!model) return null;

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async create(data: CreateClienteData): Promise<ClienteEntity> {
        try {
            const model = await this.prisma.clientes.create({
                data: {
                    id_tipo_identificacion: data.id_tipo_identificacion,
                    identificacion: data.identificacion,
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    fecha_nacimiento: data.fecha_nacimiento,
                    numero_celular: data.numero_celular,
                    email: data.email,
                },
            });

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async update(id: number, data: UpdateClienteData): Promise<ClienteEntity> {
        try {
            const model = await this.prisma.clientes.update({
                where: { id },
                data: {
                    ...(data.nombres !== undefined && { nombres: data.nombres }),
                    ...(data.apellidos !== undefined && { apellidos: data.apellidos }),
                    ...(data.fecha_nacimiento !== undefined && {
                        fecha_nacimiento: data.fecha_nacimiento,
                    }),
                    ...(data.numero_celular !== undefined && {
                        numero_celular: data.numero_celular,
                    }),
                    ...(data.email !== undefined && { email: data.email }),
                },
            });

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async softDelete(id: number): Promise<ClienteEntity> {
        try {
            const model = await this.prisma.clientes.update({
                where: { id },
                data: { estado: false },
            });

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    private mapToEntity(model: clientes): ClienteEntity {
        return new ClienteEntity(
            model.id,
            model.id_tipo_identificacion,
            model.identificacion,
            model.nombres,
            model.apellidos,
            model.fecha_nacimiento,
            model.numero_celular,
            model.email,
            model.estado,
        );
    }
}
