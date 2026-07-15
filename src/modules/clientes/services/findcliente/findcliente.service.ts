import { Injectable, NotFoundException } from '@nestjs/common';
import { ClienteRepository } from '../../interfaces/clientes.interfaces';
import { ClienteEntity } from '../../entities/cliente.entity';

@Injectable()
export class FindClienteService {
    constructor(private readonly clienteRepository: ClienteRepository) { }

    async getClienteAll(): Promise<ClienteEntity[]> {
        return this.clienteRepository.findAll();
    }

    async getClienteById(id: number): Promise<ClienteEntity> {
        const cliente = await this.clienteRepository.findById(id);
        if (!cliente) {
            throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
        }
        return cliente;
    }

    async getClienteByIdentity(identificacion: number): Promise<ClienteEntity> {
        const cliente = await this.clienteRepository.findByIdentificacion(identificacion);
        if (!cliente) {
            throw new NotFoundException(
                `Cliente con identificación ${identificacion} no encontrado`,
            );
        }
        return cliente;
    }
}
