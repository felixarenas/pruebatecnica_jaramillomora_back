import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsNotBlank } from 'src/core/validators/is-not-blank.validator';

/**
 * DTO de entrada para procesar un archivo IFC (u otra extensión) enviado en base64.
 */
export class ProcessIfcDto {
  @ApiProperty({
    description: 'Nombre del archivo sin extensión',
    example: 'modelo_edificio',
  })
  @IsDefined({ message: 'El campo nom_file es requerido en la petición' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El campo nom_file debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del archivo no puede estar vacío' })
  @IsNotBlank({ message: 'El nombre del archivo no puede estar vacío o contener solo espacios' })
  @MaxLength(200, { message: 'El nombre del archivo no puede tener más de 200 caracteres' })
  nom_file!: string;

  @ApiProperty({
    description: 'Extensión del archivo (con o sin punto)',
    example: 'ifc',
  })
  @IsDefined({ message: 'El campo ext es requerido en la petición' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El campo ext debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La extensión del archivo no puede estar vacía' })
  @IsNotBlank({ message: 'La extensión del archivo no puede estar vacía o contener solo espacios' })
  @MaxLength(20, { message: 'La extensión no puede tener más de 20 caracteres' })
  ext!: string;

  @ApiProperty({
    description: 'Tamaño declarado del archivo en bytes',
    example: 1024,
  })
  @IsDefined({ message: 'El campo size es requerido en la petición' })
  @IsInt({ message: 'El campo size debe ser un número entero' })
  @Min(0, { message: 'El campo size no puede ser negativo' })
  size!: number;

  @ApiProperty({
    description: 'Contenido del archivo en base64',
    example: 'SUZDIEZJTEU=',
  })
  @IsDefined({ message: 'El campo base64 es requerido en la petición' })
  @IsString({ message: 'El campo base64 debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El contenido base64 no puede estar vacío' })
  @IsNotBlank({ message: 'El contenido base64 no puede estar vacío o contener solo espacios' })
  base64!: string;
}
