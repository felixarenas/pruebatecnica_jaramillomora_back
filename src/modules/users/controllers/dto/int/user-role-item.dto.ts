import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt } from 'class-validator';

export class UserRoleItemDto {
    @ApiProperty({
        description: 'Identificador del rol a asignar al usuario',
        example: 1,
    })
    @IsDefined({ message: 'El campo id_role es requerido en cada elemento del arreglo roles' })
    @IsInt({ message: 'El campo id_role debe ser un número entero' })
    id_role!: number;
}
