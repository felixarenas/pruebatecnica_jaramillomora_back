import { TipoServicioEntity } from '../../entities/tipo-servicio.entity';
import { ResponseTipoServicioDto } from '../dto/out/responsetiposervicio.dto';

export class TipoServicioMapper {
    static toResponseDto(entity: TipoServicioEntity): ResponseTipoServicioDto {
        return {
            id: entity.id,
            nombre: entity.nombre,
        };
    }

    static toResponseDtoList(entities: TipoServicioEntity[]): ResponseTipoServicioDto[] {
        return entities.map((entity) => this.toResponseDto(entity));
    }
}
