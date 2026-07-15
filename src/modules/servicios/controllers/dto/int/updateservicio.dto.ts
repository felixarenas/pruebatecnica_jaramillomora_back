import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsDefined,
    IsInt,
    IsNotEmpty,
    IsOptional,
} from 'class-validator';

export class UpdateServicioDto {
    @ApiProperty({
        description: 'Identificador del servicio a actualizar',
        example: 1,
    })
    @IsDefined({ message: 'El campo id es requerido en la petición' })
    @IsInt({ message: 'El id debe ser un número entero' })
    @IsNotEmpty({ message: 'El id no puede estar vacío' })
    id!: number;

    @ApiProperty({
        description: 'Identificador del tipo de servicio',
        example: 2,
        required: false,
    })
    @IsOptional()
    @IsInt({ message: 'El id_tipo_servicio debe ser un número entero' })
    @IsNotEmpty({ message: 'El id_tipo_servicio no puede estar vacío' })
    id_tipo_servicio?: number;

    @ApiProperty({
        description: 'Fecha de inicio del servicio',
        example: '2024-03-01',
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe tener un formato válido (YYYY-MM-DD)' })
    fecha_inicio?: string;
}
