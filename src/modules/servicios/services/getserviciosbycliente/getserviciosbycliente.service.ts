import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicioRepository } from '../../interfaces/servicios.interfaces';
import { ServiciosByClienteEntity } from '../../entities/servicios-by-cliente.entity';

@Injectable()
export class GetServiciosByClienteService {
    constructor(private readonly servicioRepository: ServicioRepository) { }

    async getServiciosByCliente(
        id_tipo_identificacion: number,
        identificacion: number,
    ): Promise<ServiciosByClienteEntity> {
        const result = await this.servicioRepository.findByClienteIdentificacion(
            id_tipo_identificacion,
            identificacion,
        );

        if (!result) {
            throw new NotFoundException(
                'Cliente no encontrado con el tipo y número de identificación proporcionados',
            );
        }

        if (result.servicios.length === 0) {
            throw new NotFoundException(
                'No se encontraron servicios para el cliente indicado',
            );
        }

        return result;
    }
}
