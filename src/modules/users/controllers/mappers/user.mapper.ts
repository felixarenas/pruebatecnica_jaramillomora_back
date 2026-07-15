import { UserEntity } from "../../entities/user.entity";
import { ResponseCreateUserDto } from "../dto/out/responsecreateuser.dto";
import { ResponseUserByStoreDto } from "../dto/out/responseuserbystore.dto";

export class UserMapper {
    static toResponseDto(entity: UserEntity): ResponseCreateUserDto {
        return {
            first_names: entity.first_names,
            last_names: entity.last_names,
            email: entity.email,
            active: entity.active,
            phone_number: entity.phone_number ?? '',
            id_identity_type: entity.id_identity_type,
            identity_number: entity.identity_number,
            created_at: entity.created_at ?? new Date(),
        };
    }

    static toResponseDtoList(entities: UserEntity[]): ResponseCreateUserDto[] {
        return entities.map((entity) => this.toResponseDto(entity));
    }

    static toStoreUserResponseDto(entity: UserEntity): ResponseUserByStoreDto {
        return {
            ...this.toResponseDto(entity),
            username: entity.username,
        };
    }

    static toStoreUserResponseDtoList(entities: UserEntity[]): ResponseUserByStoreDto[] {
        return entities.map((entity) => this.toStoreUserResponseDto(entity));
    }
}
