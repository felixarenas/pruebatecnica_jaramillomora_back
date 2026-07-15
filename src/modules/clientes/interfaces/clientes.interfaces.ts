import { ClienteEntity } from '../entities/cliente.entity';

export type CreateClienteData = Omit<ClienteEntity, 'id' | 'estado'>;

export type UpdateClienteData = {
    nombres?: string;
    apellidos?: string;
    fecha_nacimiento?: Date;
    numero_celular?: string;
    email?: string;
};

export abstract class ClienteRepository {
    abstract findAll(): Promise<ClienteEntity[]>;
    abstract findById(id: number): Promise<ClienteEntity | null>;
    abstract findByIdentificacion(identificacion: number): Promise<ClienteEntity | null>;
    abstract findByEmail(email: string): Promise<ClienteEntity | null>;
    abstract create(data: CreateClienteData): Promise<ClienteEntity>;
    abstract update(id: number, data: UpdateClienteData): Promise<ClienteEntity>;
    abstract softDelete(id: number): Promise<ClienteEntity>;
}
