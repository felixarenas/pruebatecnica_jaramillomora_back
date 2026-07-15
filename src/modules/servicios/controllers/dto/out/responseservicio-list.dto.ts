import { ApiProperty } from '@nestjs/swagger';

export class ResponseServicioListDto {
    @ApiProperty({
        description: 'Identificador del servicio',
        example: 1,
    })
    id!: number;

    @ApiProperty({
        description: 'Identificador del cliente asociado',
        example: 1,
    })
    id_cliente!: number;

    @ApiProperty({
        description: 'Nombre completo del cliente asociado',
        example: 'Juan Pérez',
    })
    nom_cliente!: string;

    @ApiProperty({
        description: 'Identificador del tipo de servicio asociado',
        example: 1,
    })
    id_tipo_servicio!: number;

    @ApiProperty({
        description: 'Nombre del tipo de servicio',
        example: 'Internet residencial',
    })
    tipo_servicio!: string;

    @ApiProperty({
        description: 'Fecha de inicio del servicio',
        example: '2024-01-15',
    })
    fecha_inicio!: Date;

    @ApiProperty({
        description: 'Fecha de la última facturación',
        example: '2024-06-01',
    })
    ultima_facturacion!: Date;

    @ApiProperty({
        description: 'Monto del último pago realizado',
        example: 0,
    })
    ultimo_pago!: number;

    @ApiProperty({
        description: 'Estado activo del servicio',
        example: true,
    })
    estado!: boolean;
}
