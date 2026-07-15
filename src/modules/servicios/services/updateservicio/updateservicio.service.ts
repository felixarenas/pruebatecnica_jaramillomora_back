import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UpdateServicioDto } from '../../controllers/dto/int/updateservicio.dto';
import { ServicioEntity } from '../../entities/servicio.entity';
import { ServicioRepository, UpdateServicioData } from '../../interfaces/servicios.interfaces';

@Injectable()
export class UpdateServicioService {
    constructor(private readonly servicioRepository: ServicioRepository) { }

    async execute(dto: UpdateServicioDto): Promise<ServicioEntity> {
        const { id, ...fields } = dto;

        if (!this.hasFieldsToUpdate(fields)) {
            throw new BadRequestException(
                'Debe proporcionar al menos un campo para actualizar',
            );
        }

        const servicio = await this.servicioRepository.findById(id);

        if (!servicio) {
            throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
        }

        if (
            fields.id_tipo_servicio !== undefined &&
            fields.id_tipo_servicio !== servicio.id_tipo_servicio
        ) {
            const existing = await this.servicioRepository.findActiveByClienteAndTipo(
                servicio.id_cliente,
                fields.id_tipo_servicio,
            );

            if (existing && existing.id !== id) {
                throw new ConflictException(
                    'El cliente ya tiene un servicio activo del mismo tipo',
                );
            }
        }

        const updateData: UpdateServicioData = {};

        if (fields.id_tipo_servicio !== undefined) {
            updateData.id_tipo_servicio = fields.id_tipo_servicio;
        }
        if (fields.fecha_inicio !== undefined) {
            updateData.fecha_inicio = new Date(fields.fecha_inicio);
        }

        return this.servicioRepository.update(id, updateData);
    }

    private hasFieldsToUpdate(fields: Omit<UpdateServicioDto, 'id'>): boolean {
        return Object.values(fields).some((value) => value !== undefined);
    }
}
