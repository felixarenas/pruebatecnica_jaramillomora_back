import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDefined, IsInt, IsNotEmpty } from "class-validator";

export class ActiveInactiveUserDto {
    @ApiProperty({
        description: 'Identificador del usuario',
        example: 1,
    })
    @IsDefined({ message: 'El campo id es requerido en la petición' })
    @IsInt({ message: 'El id debe ser un número entero' })
    @IsNotEmpty({ message: 'El id no puede estar vacío' })
    id!: number;

    @ApiProperty({
        description: 'Estado activo del usuario',
        example: true,
    })
    @IsDefined({ message: 'El campo active es requerido en la petición' })
    @IsBoolean({ message: 'El campo active debe ser un valor booleano' })
    active!: boolean;
}
