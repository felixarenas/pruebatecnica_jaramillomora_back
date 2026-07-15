import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, IsNotEmpty, Min } from 'class-validator';

export class GetServiciosByClienteDto {
    @ApiProperty({
        description: 'Identificador del tipo de identificación del cliente',
        example: 1,
    })
    @IsDefined({ message: 'El campo id_tipo_identificacion es requerido en la petición' })
    @IsInt({ message: 'El id_tipo_identificacion debe ser un número entero' })
    @IsNotEmpty({ message: 'El id_tipo_identificacion no puede estar vacío' })
    id_tipo_identificacion!: number;

    @ApiProperty({
        description: 'Número de identificación del cliente',
        example: 1234567890,
    })
    @IsDefined({ message: 'El campo identificacion es requerido en la petición' })
    @IsInt({ message: 'La identificacion debe ser un número entero' })
    @Min(1, { message: 'La identificacion debe ser un valor positivo' })
    identificacion!: number;
}
