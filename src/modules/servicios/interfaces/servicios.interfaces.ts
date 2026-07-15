import { ServicioEntity } from '../entities/servicio.entity';
import { ServicioListEntity } from '../entities/servicio-list.entity';
import { ServiciosByClienteEntity } from '../entities/servicios-by-cliente.entity';

export type CreateServicioData = Omit<ServicioEntity, 'id' | 'estado'>;

export type UpdateServicioData = {
    id_tipo_servicio?: number;
    fecha_inicio?: Date;
};

export abstract class ServicioRepository {
    abstract findAll(): Promise<ServicioListEntity[]>;
    abstract findById(id: number): Promise<ServicioEntity | null>;
    abstract findByIdCliente(id_cliente: number): Promise<ServicioEntity[]>;
    abstract findByClienteIdentificacion(
        id_tipo_identificacion: number,
        identificacion: number,
    ): Promise<ServiciosByClienteEntity | null>;
    abstract findActiveByClienteAndTipo(
        id_cliente: number,
        id_tipo_servicio: number,
    ): Promise<ServicioEntity | null>;
    abstract create(data: CreateServicioData): Promise<ServicioEntity>;
    abstract update(id: number, data: UpdateServicioData): Promise<ServicioEntity>;
    abstract softDelete(id: number): Promise<ServicioEntity>;
}
