import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ServicioRepository } from '../../interfaces/servicios.interfaces';
import { ServicioEntity } from '../../entities/servicio.entity';

@Injectable()
export class DeleteServicioService {
    constructor(private readonly servicioRepository: ServicioRepository) { }

    async execute(id: number): Promise<ServicioEntity> {
        const servicio = await this.servicioRepository.findById(id);

        if (!servicio) {
            throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
        }

        if (!servicio.estado) {
            throw new BadRequestException('El servicio ya se encuentra inactivo');
        }

        return this.servicioRepository.softDelete(id);
    }
}
