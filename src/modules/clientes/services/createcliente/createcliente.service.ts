import { ConflictException, Injectable } from '@nestjs/common';
import { ClienteRepository } from '../../interfaces/clientes.interfaces';
import { CreateClienteDto } from '../../controllers/dto/int/createcliente.dto';
import { ClienteEntity } from '../../entities/cliente.entity';

@Injectable()
export class CreateClienteService {
    constructor(private readonly clienteRepository: ClienteRepository) { }

    async create(dto: CreateClienteDto): Promise<ClienteEntity> {
        const existingByIdentificacion = await this.clienteRepository.findByIdentificacion(
            dto.identificacion,
        );

        if (existingByIdentificacion) {
            throw new ConflictException('La identificación ya está registrada');
        }

        const existingByEmail = await this.clienteRepository.findByEmail(dto.email);

        if (existingByEmail) {
            throw new ConflictException('El correo electrónico ya está registrado');
        }

        return this.clienteRepository.create({
            id_tipo_identificacion: dto.id_tipo_identificacion,
            identificacion: dto.identificacion,
            nombres: dto.nombres,
            apellidos: dto.apellidos,
            fecha_nacimiento: new Date(dto.fecha_nacimiento),
            numero_celular: dto.numero_celular,
            email: dto.email,
        });
    }
}
