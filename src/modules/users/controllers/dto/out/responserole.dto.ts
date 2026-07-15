import { ApiProperty } from '@nestjs/swagger';

export class ResponseRoleDto {
    @ApiProperty({
        description: 'Identificador del rol',
        example: 1,
    })
    id!: number;

    @ApiProperty({
        description: 'Nombre del rol',
        example: 'ADMIN',
    })
    name_role!: string;
}
