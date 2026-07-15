import { ApiProperty } from '@nestjs/swagger';
import { EMAIL_ADDRESS } from 'src/core/config';

export class ResponseClienteDto {
    @ApiProperty({
        description: 'Identificador del cliente',
        example: 1,
    })
    id!: number;

    @ApiProperty({
        description: 'Tipo de identificación del cliente',
        example: 4,
    })
    id_tipo_identificacion!: number;

    @ApiProperty({
        description: 'Número de identificación del cliente',
        example: 1234567890,
    })
    identificacion!: number;

    @ApiProperty({
        description: 'Nombres del cliente',
        example: 'Juan',
    })
    nombres!: string;

    @ApiProperty({
        description: 'Apellidos del cliente',
        example: 'Pérez',
    })
    apellidos!: string;

    @ApiProperty({
        description: 'Fecha de nacimiento del cliente',
        example: '1990-05-15',
    })
    fecha_nacimiento!: Date;

    @ApiProperty({
        description: 'Número de celular del cliente',
        example: '3001234567',
    })
    numero_celular!: string;

    @ApiProperty({
        description: 'Correo electrónico del cliente',
        example: EMAIL_ADDRESS,
    })
    email!: string;

    @ApiProperty({
        description: 'Estado activo del cliente',
        example: true,
    })
    estado!: boolean;
}
