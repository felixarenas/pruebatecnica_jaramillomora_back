import { ApiProperty } from "@nestjs/swagger";
import { EMAIL_ADDRESS } from "src/core/config";

export class ResponseCreateUserDto {
    @ApiProperty({
        description: 'Nombres del usuario',
        example: 'Juan',
    })
    first_names!: string;

    @ApiProperty({
        description: 'Apellidos del usuario',
        example: 'Perez',
    })
    last_names!: string;

    @ApiProperty({
        description: 'Correo del usuario',
        example: EMAIL_ADDRESS,
    })
    email!: string;

    @ApiProperty({
        description: 'Estado activo del usuario',
        example: true,
    })
    active!: boolean;

    @ApiProperty({
        description: 'Número de teléfono del usuario',
        example: '3250000000',
    })
    phone_number!: string;

    @ApiProperty({
        description: 'Fecha de creación',
    })
    created_at!: Date;

    @ApiProperty({
        description: 'Tipo de documento de identidad',
        example: 1,
    })
    id_identity_type!: number;

    @ApiProperty({
        description: 'Número de documento de identidad',
        example: '123456789',
    })
    identity_number!: string;
    
}
