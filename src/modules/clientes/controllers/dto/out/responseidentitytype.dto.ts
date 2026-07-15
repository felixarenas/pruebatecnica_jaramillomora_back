import { ApiProperty } from '@nestjs/swagger';

export class ResponseIdentityTypeDto {
    @ApiProperty({
        description: 'Identificador del tipo de identificación',
        example: 4,
    })
    id!: number;

    @ApiProperty({
        description: 'Abreviatura del tipo de identificación',
        example: 'CC',
    })
    abr!: string;

    @ApiProperty({
        description: 'Nombre del tipo de identificación',
        example: 'Cédula de Ciudadanía',
    })
    name!: string;

    @ApiProperty({
        description: 'Código DIAN asociado al tipo de identificación',
        example: '13',
        nullable: true,
    })
    dian_code!: string | null;

    @ApiProperty({
        description: 'Descripción del tipo de identificación',
        example: 'Identifica a colombianos mayores de 18 años. Expedido por la RNEC',
        nullable: true,
    })
    description!: string | null;
}
