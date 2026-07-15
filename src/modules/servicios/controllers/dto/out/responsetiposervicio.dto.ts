import { ApiProperty } from '@nestjs/swagger';

export class ResponseTipoServicioDto {
    @ApiProperty({
        description: 'Identificador del tipo de servicio',
        example: 1,
    })
    id!: number;

    @ApiProperty({
        description: 'Nombre del tipo de servicio',
        example: 'Internet residencial',
    })
    nombre!: string;
}
