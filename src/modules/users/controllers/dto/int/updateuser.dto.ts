import { ApiProperty } from '@nestjs/swagger';
import {
    IsDefined,
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EMAIL_ADDRESS } from 'src/core/config';
import { IsNotBlank } from 'src/core/validators/is-not-blank.validator';
import { IsOnlyNumbers } from 'src/core/validators/is-only-numbers.decorator';

export class UpdateUserDto {
    @ApiProperty({
        description: 'Identificador del usuario a actualizar',
        example: 1,
    })
    @IsDefined({ message: 'El campo id es requerido en la petición' })
    @IsInt({ message: 'El id debe ser un número entero' })
    @IsNotEmpty({ message: 'El id no puede estar vacío' })
    id!: number;

    @ApiProperty({
        description: 'Correo del usuario',
        example: EMAIL_ADDRESS,
        required: false,
    })
    @IsOptional()
    @IsNotEmpty({ message: 'El correo del usuario no puede estar vacío' })
    @IsNotBlank({ message: 'El correo del usuario no puede estar vacío o contener solo espacios' })
    @IsEmail({}, { message: 'El correo del usuario debe ser una dirección de correo electrónico válida' })
    email?: string;

    @ApiProperty({
        description: 'Nombres del usuario',
        example: 'Juan',
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Los nombres del usuario no pueden estar vacíos' })
    @IsNotBlank({ message: 'Los nombres del usuario no pueden estar vacíos o contener solo espacios' })
    first_names?: string;

    @ApiProperty({
        description: 'Apellidos del usuario',
        example: 'Perez',
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Los apellidos del usuario no pueden estar vacíos' })
    @IsNotBlank({ message: 'Los apellidos del usuario no pueden estar vacíos o contener solo espacios' })
    last_names?: string;

    @ApiProperty({
        description: 'Número de teléfono del usuario',
        example: '3250000000',
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty({ message: 'El número de teléfono no puede estar vacío' })
    @IsNotBlank({ message: 'El número de teléfono no puede estar vacío o contener solo espacios' })
    @IsOnlyNumbers({ minLength: 6, maxLength: 10 }, { message: 'El teléfono debe tener entre 7 y 15 dígitos' })
    phone_number?: string;

    @ApiProperty({
        description: 'Tipo de identificación del usuario',
        example: 4,
        required: false,
    })
    @IsOptional()
    @IsInt()
    @IsNotEmpty({ message: 'El tipo de identificación no puede estar vacío' })
    id_identity_type?: number;

    @ApiProperty({
        description: 'Número de identificación del usuario',
        example: '123456789',
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'El número de identificación no puede estar vacío' })
    @IsNotBlank({ message: 'El número de identificación no puede estar vacío o contener solo espacios' })
    @IsOnlyNumbers({ minLength: 6, maxLength: 50 }, { message: 'El número de identificación debe tener entre 6 y 50 dígitos' })
    identity_number?: string;

    @ApiProperty({
        description: 'Nombre de usuario para inicio de sesión',
        example: 'jperez',
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
    @IsNotBlank({ message: 'El nombre de usuario no puede estar vacío o contener solo espacios' })
    @MaxLength(100, { message: 'El nombre de usuario no puede tener más de 100 caracteres' })
    username?: string;

    @ApiProperty({
        description: 'Rol principal del usuario en la tabla users',
        example: 3,
        required: false,
    })
    @IsOptional()
    @IsInt()
    id_role?: number;
}
