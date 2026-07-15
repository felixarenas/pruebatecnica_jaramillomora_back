import { ApiProperty } from '@nestjs/swagger';

export class ResponseServicioByClienteItemDto {
    @ApiProperty({
        description: 'Identificador del servicio',
        example: 1,
    })
    id_servicio!: number;

    @ApiProperty({
        description: 'Nombre del tipo de servicio',
        example: 'Internet residencial',
    })
    nom_servicio!: string;

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
        example: 50000,
    })
    ultimo_pago!: number;

    @ApiProperty({
        description: 'Estado activo del servicio',
        example: true,
    })
    estado_servicio!: boolean;
}

export class ResponseServiciosByClienteDto {
    @ApiProperty({
        description: 'Identificador del cliente',
        example: 1,
    })
    id_cliente!: number;

    @ApiProperty({
        description: 'Nombre completo del cliente',
        example: 'Juan Pérez',
    })
    nom_cliente!: string;

    @ApiProperty({
        description: 'Nombre del tipo de identificación',
        example: 'Cédula de ciudadanía',
    })
    tipo_identificacion!: string;

    @ApiProperty({
        description: 'Número de identificación del cliente',
        example: 1234567890,
    })
    numero_identificacion!: number;

    @ApiProperty({
        description: 'Servicios asociados al cliente',
        type: [ResponseServicioByClienteItemDto],
    })
    servicios!: ResponseServicioByClienteItemDto[];
}
