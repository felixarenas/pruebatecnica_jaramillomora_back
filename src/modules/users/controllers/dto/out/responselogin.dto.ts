import { ApiProperty } from "@nestjs/swagger";

export class ResponseLoginDto {
    
    @ApiProperty({
        description: 'Token de acceso',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    accessToken!: string;

    @ApiProperty({
        description: 'Datos del usuario autenticado',
        example: {
            id: 1,
            full_name: 'Juan Perez',
            email: 'juan.perez@correo.com',
        },
    })
    user!: {
        id: number;
        full_name: string;
        email: string;
    };
}
