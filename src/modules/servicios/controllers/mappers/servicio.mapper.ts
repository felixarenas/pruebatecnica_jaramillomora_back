import { ServicioEntity } from '../../entities/servicio.entity';
import { ServicioListEntity } from '../../entities/servicio-list.entity';
import { ResponseServicioDto } from '../dto/out/responseservicio.dto';
import { ResponseServicioListDto } from '../dto/out/responseservicio-list.dto';

export class ServicioMapper {
    static toListResponseDto(entity: ServicioListEntity): ResponseServicioListDto {
        return {
            id: entity.id,
            id_cliente: entity.id_cliente,
            nom_cliente: entity.cliente_nombre,
            id_tipo_servicio: entity.id_tipo_servicio,
            tipo_servicio: entity.tipo_servicio,
            fecha_inicio: entity.fecha_inicio,
            ultima_facturacion: entity.ultima_facturacion,
            ultimo_pago: entity.ultimo_pago,
            estado: entity.estado,
        };
    }

    static toListResponseDtoList(entities: ServicioListEntity[]): ResponseServicioListDto[] {
        return entities.map((entity) => this.toListResponseDto(entity));
    }

    static toResponseDto(entity: ServicioEntity): ResponseServicioDto {
        return {
            id: entity.id,
            id_cliente: entity.id_cliente,
            id_tipo_servicio: entity.id_tipo_servicio,
            fecha_inicio: entity.fecha_inicio,
            ultima_facturacion: entity.ultima_facturacion,
            ultimo_pago: entity.ultimo_pago,
            estado: entity.estado,
        };
    }

    static toResponseDtoList(entities: ServicioEntity[]): ResponseServicioDto[] {
        return entities.map((entity) => this.toResponseDto(entity));
    }
}
