import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsDefined,
    IsInt,
    IsNotEmpty,
    ValidateNested,
} from 'class-validator';
import { UserRoleItemDto } from './user-role-item.dto';

export class AddRolesUserDto {
    @ApiProperty({
        description: 'Identificador del usuario al que se reconfigurarán los roles',
        example: 1,
    })
    @IsDefined({ message: 'El campo id_user es requerido en la petición' })
    @IsInt({ message: 'El campo id_user debe ser un número entero' })
    @IsNotEmpty({ message: 'El campo id_user no puede estar vacío' })
    id_user!: number;

    @ApiProperty({
        description: 'Identificador de la tienda a la que pertenece el usuario',
        example: 1,
    })
    @IsDefined({ message: 'El campo id_store es requerido en la petición' })
    @IsInt({ message: 'El campo id_store debe ser un número entero' })
    @IsNotEmpty({ message: 'El campo id_store no puede estar vacío' })
    id_store!: number;

    @ApiProperty({
        description: 'Roles a asignar al usuario en la tabla user_roles',
        example: [{ id_role: 1 }, { id_role: 3 }],
        type: [UserRoleItemDto],
        isArray: true,
    })
    @IsDefined({ message: 'El campo roles es requerido en la petición' })
    @IsArray({ message: 'El campo roles debe ser un arreglo' })
    @ValidateNested({ each: true })
    @Type(() => UserRoleItemDto)
    roles!: UserRoleItemDto[];
}
