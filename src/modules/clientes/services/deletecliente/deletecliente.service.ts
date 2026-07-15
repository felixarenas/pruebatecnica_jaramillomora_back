import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ClienteRepository } from '../../interfaces/clientes.interfaces';
import { ClienteEntity } from '../../entities/cliente.entity';

@Injectable()
export class DeleteClienteService {
    constructor(private readonly clienteRepository: ClienteRepository) { }

    async execute(id: number): Promise<ClienteEntity> {
        const cliente = await this.clienteRepository.findById(id);

        if (!cliente) {
            throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
        }

        if (!cliente.estado) {
            throw new BadRequestException('El cliente ya se encuentra inactivo');
        }

        return this.clienteRepository.softDelete(id);
    }
}
