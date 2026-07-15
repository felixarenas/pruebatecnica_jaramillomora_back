import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
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

export class UpdateClienteDto {
    @ApiProperty({
        description: 'Identificador del cliente a actualizar',
        example: 1,
    })
    @IsDefined({ message: 'El campo id es requerido en la petición' })
    @IsInt({ message: 'El id debe ser un número entero' })
    @IsNotEmpty({ message: 'El id no puede estar vacío' })
    id!: number;

    @ApiProperty({
        description: 'Nombres del cliente',
        example: 'Juan',
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Los nombres del cliente no pueden estar vacíos' })
    @IsNotBlank({ message: 'Los nombres del cliente no pueden estar vacíos o contener solo espacios' })
    @MaxLength(80, { message: 'Los nombres no pueden tener más de 80 caracteres' })
    nombres?: string;

    @ApiProperty({
        description: 'Apellidos del cliente',
        example: 'Pérez',
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Los apellidos del cliente no pueden estar vacíos' })
    @IsNotBlank({ message: 'Los apellidos del cliente no pueden estar vacíos o contener solo espacios' })
    @MaxLength(80, { message: 'Los apellidos no pueden tener más de 80 caracteres' })
    apellidos?: string;

    @ApiProperty({
        description: 'Fecha de nacimiento del cliente',
        example: '1990-05-15',
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)' })
    fecha_nacimiento?: string;

    @ApiProperty({
        description: 'Número de celular del cliente',
        example: '3001234567',
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty({ message: 'El número de celular no puede estar vacío' })
    @IsNotBlank({ message: 'El número de celular no puede estar vacío o contener solo espacios' })
    @IsOnlyNumbers({ minLength: 10, maxLength: 10 }, { message: 'El número de celular debe tener 10 dígitos' })
    numero_celular?: string;

    @ApiProperty({
        description: 'Correo electrónico del cliente',
        example: EMAIL_ADDRESS,
        required: false,
    })
    @IsOptional()
    @IsNotEmpty({ message: 'El correo del cliente no puede estar vacío' })
    @IsNotBlank({ message: 'El correo del cliente no puede estar vacío o contener solo espacios' })
    @IsEmail({}, { message: 'El correo del cliente debe ser una dirección de correo electrónico válida' })
    @MaxLength(1000, { message: 'El correo no puede tener más de 1000 caracteres' })
    email?: string;
}
