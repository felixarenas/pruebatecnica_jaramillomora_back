import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsDefined,
    IsInt,
    IsNotEmpty,
    Min,
} from 'class-validator';

export class CreateServicioDto {
    @ApiProperty({
        description: 'Identificador del cliente asociado al servicio',
        example: 1,
    })
    @IsDefined({ message: 'El campo id_cliente es requerido en la petición' })
    @IsInt({ message: 'El id_cliente debe ser un número entero' })
    @IsNotEmpty({ message: 'El id_cliente no puede estar vacío' })
    id_cliente!: number;

    @ApiProperty({
        description: 'Identificador del tipo de servicio',
        example: 1,
    })
    @IsDefined({ message: 'El campo id_tipo_servicio es requerido en la petición' })
    @IsInt({ message: 'El id_tipo_servicio debe ser un número entero' })
    @IsNotEmpty({ message: 'El id_tipo_servicio no puede estar vacío' })
    id_tipo_servicio!: number;

    @ApiProperty({
        description: 'Fecha de inicio del servicio',
        example: '2024-01-15',
    })
    @IsDefined({ message: 'El campo fecha_inicio es requerido en la petición' })
    @IsDateString({}, { message: 'La fecha de inicio debe tener un formato válido (YYYY-MM-DD)' })
    fecha_inicio!: string;

    @ApiProperty({
        description: 'Fecha de la última facturación del servicio',
        example: '2024-06-01',
    })
    @IsDefined({ message: 'El campo ultima_facturacion es requerido en la petición' })
    @IsDateString({}, { message: 'La última facturación debe tener un formato válido (YYYY-MM-DD)' })
    ultima_facturacion!: string;

    @ApiProperty({
        description: 'Monto del último pago realizado',
        example: 0,
    })
    @IsDefined({ message: 'El campo ultimo_pago es requerido en la petición' })
    @IsInt({ message: 'El último pago debe ser un número entero' })
    @Min(0, { message: 'El último pago no puede ser un valor negativo' })
    ultimo_pago!: number;
}
