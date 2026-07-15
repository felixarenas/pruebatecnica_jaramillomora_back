import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicioRepository } from '../../interfaces/servicios.interfaces';
import { ServicioEntity } from '../../entities/servicio.entity';
import { ServicioListEntity } from '../../entities/servicio-list.entity';

@Injectable()
export class FindServicioService {
    constructor(private readonly servicioRepository: ServicioRepository) { }

    async getAllServicios(): Promise<ServicioListEntity[]> {
        return this.servicioRepository.findAll();
    }

    async getServicioById(id: number): Promise<ServicioEntity> {
        const servicio = await this.servicioRepository.findById(id);
        if (!servicio) {
            throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
        }
        return servicio;
    }

    async getServicioByIdCliente(id_cliente: number): Promise<ServicioEntity[]> {
        const servicios = await this.servicioRepository.findByIdCliente(id_cliente);
        if (servicios.length === 0) {
            throw new NotFoundException(
                `No se encontraron servicios para el cliente con ID ${id_cliente}`,
            );
        }
        return servicios;
    }
}
