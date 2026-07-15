import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsDefined,
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsString,
    MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EMAIL_ADDRESS } from 'src/core/config';
import { IsNotBlank } from 'src/core/validators/is-not-blank.validator';
import { IsOnlyNumbers } from 'src/core/validators/is-only-numbers.decorator';

export class CreateClienteDto {
    @ApiProperty({
        description: 'Tipo de identificación del cliente',
        example: 4,
    })
    @IsDefined({ message: 'El campo id_tipo_identificacion es requerido en la petición' })
    @IsInt({ message: 'El tipo de identificación debe ser un número entero' })
    @IsNotEmpty({ message: 'El tipo de identificación no puede estar vacío' })
    id_tipo_identificacion!: number;

    @ApiProperty({
        description: 'Número de identificación del cliente',
        example: 1234567890,
    })
    @IsDefined({ message: 'El campo identificacion es requerido en la petición' })
    @IsInt({ message: 'La identificación debe ser un número entero' })
    @IsNotEmpty({ message: 'La identificación no puede estar vacía' })
    identificacion!: number;

    @ApiProperty({
        description: 'Nombres del cliente',
        example: 'Juan',
    })
    @IsDefined({ message: 'El campo nombres es requerido en la petición' })
    @IsString()
    @IsNotEmpty({ message: 'Los nombres del cliente no pueden estar vacíos' })
    @IsNotBlank({ message: 'Los nombres del cliente no pueden estar vacíos o contener solo espacios' })
    @MaxLength(80, { message: 'Los nombres no pueden tener más de 80 caracteres' })
    nombres!: string;

    @ApiProperty({
        description: 'Apellidos del cliente',
        example: 'Pérez',
    })
    @IsDefined({ message: 'El campo apellidos es requerido en la petición' })
    @IsString()
    @IsNotEmpty({ message: 'Los apellidos del cliente no pueden estar vacíos' })
    @IsNotBlank({ message: 'Los apellidos del cliente no pueden estar vacíos o contener solo espacios' })
    @MaxLength(80, { message: 'Los apellidos no pueden tener más de 80 caracteres' })
    apellidos!: string;

    @ApiProperty({
        description: 'Fecha de nacimiento del cliente',
        example: '1990-05-15',
    })
    @IsDefined({ message: 'El campo fecha_nacimiento es requerido en la petición' })
    @IsDateString({}, { message: 'La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)' })
    fecha_nacimiento!: string;

    @ApiProperty({
        description: 'Número de celular del cliente',
        example: '3001234567',
    })
    @IsDefined({ message: 'El campo numero_celular es requerido en la petición' })
    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty({ message: 'El número de celular no puede estar vacío' })
    @IsNotBlank({ message: 'El número de celular no puede estar vacío o contener solo espacios' })
    @IsOnlyNumbers({ minLength: 10, maxLength: 10 }, { message: 'El número de celular debe tener 10 dígitos' })
    numero_celular!: string;

    @ApiProperty({
        description: 'Correo electrónico del cliente',
        example: EMAIL_ADDRESS,
    })
    @IsDefined({ message: 'El campo email es requerido en la petición' })
    @IsNotEmpty({ message: 'El correo del cliente no puede estar vacío' })
    @IsNotBlank({ message: 'El correo del cliente no puede estar vacío o contener solo espacios' })
    @IsEmail({}, { message: 'El correo del cliente debe ser una dirección de correo electrónico válida' })
    @MaxLength(1000, { message: 'El correo no puede tener más de 1000 caracteres' })
    email!: string;
}
