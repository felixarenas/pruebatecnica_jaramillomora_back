import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsNotBlank } from 'src/core/validators/is-not-blank.validator';

/**
 * DTO de entrada para procesar un archivo IFC (u otra extensión) enviado en base64.
 */
export class PropertySetsIfcDto {
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
}
