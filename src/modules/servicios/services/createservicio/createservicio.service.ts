import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ClienteRepository } from 'src/modules/clientes/interfaces/clientes.interfaces';
import { ServicioRepository } from '../../interfaces/servicios.interfaces';
import { CreateServicioDto } from '../../controllers/dto/int/createservicio.dto';
import { ServicioEntity } from '../../entities/servicio.entity';

@Injectable()
export class CreateServicioService {
    constructor(
        private readonly servicioRepository: ServicioRepository,
        private readonly clienteRepository: ClienteRepository,
    ) { }

    async create(dto: CreateServicioDto): Promise<ServicioEntity> {
        const cliente = await this.clienteRepository.findById(dto.id_cliente);

        if (!cliente) {
            throw new NotFoundException(`Cliente con ID ${dto.id_cliente} no encontrado`);
        }

        const existing = await this.servicioRepository.findActiveByClienteAndTipo(
            dto.id_cliente,
            dto.id_tipo_servicio,
        );

        if (existing) {
            throw new ConflictException(
                'El cliente ya tiene un servicio activo del mismo tipo',
            );
        }

        return this.servicioRepository.create({
            id_cliente: dto.id_cliente,
            id_tipo_servicio: dto.id_tipo_servicio,
            fecha_inicio: new Date(dto.fecha_inicio),
            ultima_facturacion: new Date(dto.ultima_facturacion),
            ultimo_pago: dto.ultimo_pago,
        });
    }
}
