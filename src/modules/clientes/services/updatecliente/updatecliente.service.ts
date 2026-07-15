import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UpdateClienteDto } from '../../controllers/dto/int/updatecliente.dto';
import { ClienteEntity } from '../../entities/cliente.entity';
import { ClienteRepository, UpdateClienteData } from '../../interfaces/clientes.interfaces';

@Injectable()
export class UpdateClienteService {
    constructor(private readonly clienteRepository: ClienteRepository) { }

    async execute(dto: UpdateClienteDto): Promise<ClienteEntity> {
        const { id, ...fields } = dto;

        if (!this.hasFieldsToUpdate(fields)) {
            throw new BadRequestException(
                'Debe proporcionar al menos un campo para actualizar',
            );
        }

        const cliente = await this.clienteRepository.findById(id);

        if (!cliente) {
            throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
        }

        if (fields.email !== undefined && fields.email !== cliente.email) {
            const existing = await this.clienteRepository.findByEmail(fields.email);

            if (existing && existing.id !== id) {
                throw new ConflictException('El correo electrónico ya está registrado');
            }
        }

        const updateData: UpdateClienteData = {};

        if (fields.nombres !== undefined) updateData.nombres = fields.nombres;
        if (fields.apellidos !== undefined) updateData.apellidos = fields.apellidos;
        if (fields.fecha_nacimiento !== undefined) {
            updateData.fecha_nacimiento = new Date(fields.fecha_nacimiento);
        }
        if (fields.numero_celular !== undefined) {
            updateData.numero_celular = fields.numero_celular;
        }
        if (fields.email !== undefined) updateData.email = fields.email;

        return this.clienteRepository.update(id, updateData);
    }

    private hasFieldsToUpdate(fields: Omit<UpdateClienteDto, 'id'>): boolean {
        return Object.values(fields).some((value) => value !== undefined);
    }
}
