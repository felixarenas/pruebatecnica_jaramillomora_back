import { IsArray, IsDefined, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EMAIL_ADDRESS } from "src/core/config";
import { Transform, Type } from 'class-transformer';
import { IsNotBlank } from "src/core/validators/is-not-blank.validator";
import { UserRoleItemDto } from "./user-role-item.dto";
import { IsOnlyNumbers } from "src/core/validators/is-only-numbers.decorator";

export class CreateUserDto {
    @ApiProperty({
        description: 'Nombres del usuario',
        example: 'Juan',
    })
    @IsDefined({ message: 'El campo first_names es requerido en la petición' })
    @IsString()
    @IsNotEmpty({ message: 'Los nombres del usuario no pueden estar vacíos' })
    @IsNotBlank({ message: 'Los nombres del usuario no pueden estar vacíos o contener solo espacios' })
    first_names!: string;

    @ApiProperty({
        description: 'Apellidos del usuario',
        example: 'Perez',
    })
    @IsDefined({ message: 'El campo last_names es requerido en la petición' })
    @IsString()
    @IsNotEmpty({ message: 'Los apellidos del usuario no pueden estar vacíos' })
    @IsNotBlank({ message: 'Los apellidos del usuario no pueden estar vacíos o contener solo espacios' })
    last_names!: string;

    @ApiProperty({
        description: 'Correo del usuario',
        example: EMAIL_ADDRESS,
    })
    @IsDefined({ message: 'El campo email es requerido en la petición' })
    @IsNotEmpty({ message: 'El correo del usuario no puede estar vacío' })
    @IsNotBlank({ message: 'El correo del usuario no puede estar vacío o contener solo espacios' })
    @IsEmail({}, { message: 'El correo del usuario debe ser una dirección de correo electrónico válida' })
    email!: string;

    @ApiProperty({
        description: 'Nombre de usuario para inicio de sesión',
        example: 'jperez',
    })
    @IsDefined({ message: 'El campo username es requerido en la petición' })
    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
    @IsNotBlank({ message: 'El nombre de usuario no puede estar vacío o contener solo espacios' })
    @MaxLength(100, { message: 'El nombre de usuario no puede tener más de 100 caracteres' })
    username!: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: '123456',
    })
    @IsDefined({ message: 'El campo passwd es requerido en la petición' })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @IsNotBlank({ message: 'La contraseña no puede estar vacía o contener solo espacios' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    passwd!: string;

    @ApiProperty({
        description: 'Número de teléfono del usuario',
        example: '3250000000',
    })
    @IsDefined({ message: 'El campo phone_number es requerido en la petición' })
    @Transform(({ value }) => value?.trim())
    @IsString()    
    @IsNotEmpty({ message: 'El número de teléfono no puede estar vacío' })
    @IsNotBlank({ message: 'El número de teléfono no puede estar vacío o contener solo espacios' })
    @IsOnlyNumbers({ minLength: 6, maxLength: 10 }, { message: 'El teléfono debe tener entre 7 y 15 dígitos' })
    phone_number!: string;

    @ApiProperty({
        description: 'Tipo de identificación del usuario',
        example: '4 => Cédula de ciudadanía, 3 => Tarjeta de identidad, 5 => Cédula de extranjería, 6 => Pasaporte',
    })
    @IsDefined({ message: 'El campo id_identity_type es requerido en la petición' })
    @IsInt()
    @IsNotEmpty({ message: 'El tipo de identificación no puede estar vacío' })
    id_identity_type!: number;

    @ApiProperty({
        description: 'Número de identificación del usuario',
        example: '123456789',
    })
    @IsDefined({ message: 'El campo identity_number es requerido en la petición' })
    @IsString()
    @IsNotEmpty({ message: 'El número de identificación no puede estar vacío' })
    @IsNotBlank({ message: 'El número de identificación no puede estar vacío o contener solo espacios' })
    @IsOnlyNumbers({ minLength: 6, maxLength: 50 }, { message: 'El número de identificación debe tener entre 6 y 50 dígitos' })
    identity_number!: string;

}