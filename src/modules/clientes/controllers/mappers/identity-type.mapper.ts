import { IdentityTypeEntity } from '../../entities/identity-type.entity';
import { ResponseIdentityTypeDto } from '../dto/out/responseidentitytype.dto';

export class IdentityTypeMapper {
    static toResponseDto(entity: IdentityTypeEntity): ResponseIdentityTypeDto {
        return {
            id: entity.id,
            abr: entity.abr,
            name: entity.name,
            dian_code: entity.dian_code,
            description: entity.description,
        };
    }

    static toResponseDtoList(entities: IdentityTypeEntity[]): ResponseIdentityTypeDto[] {
        return entities.map((entity) => this.toResponseDto(entity));
    }
}
