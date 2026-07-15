import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotBlank } from 'src/core/validators/is-not-blank.validator';

export class LoginDto {
  @ApiProperty({ example: 'testsuser' })
  @IsString()
  @IsDefined({ message: 'El login es requerido' })  
  @IsNotEmpty({ message: 'El login no puede estar vacío' })
  @IsNotBlank({ message: 'El login no puede estar vacío o contener solo espacios' })
  login!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsDefined({ message: 'La contraseña es requerida' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @IsNotBlank({ message: 'La contraseña no puede estar vacía o contener solo espacios' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  passwd!: string;
}
