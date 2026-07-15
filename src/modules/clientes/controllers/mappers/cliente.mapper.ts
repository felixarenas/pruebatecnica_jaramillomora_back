import { ClienteEntity } from '../../entities/cliente.entity';
import { ResponseClienteDto } from '../dto/out/responsecliente.dto';

export class ClienteMapper {
    static toResponseDto(entity: ClienteEntity): ResponseClienteDto {
        return {
            id: entity.id,
            id_tipo_identificacion: entity.id_tipo_identificacion,
            identificacion: entity.identificacion,
            nombres: entity.nombres,
            apellidos: entity.apellidos,
            fecha_nacimiento: entity.fecha_nacimiento,
            numero_celular: entity.numero_celular,
            email: entity.email,
            estado: entity.estado,
        };
    }

    static toResponseDtoList(entities: ClienteEntity[]): ResponseClienteDto[] {
        return entities.map((entity) => this.toResponseDto(entity));
    }
}
