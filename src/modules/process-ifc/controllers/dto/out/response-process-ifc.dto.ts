import { ApiProperty } from '@nestjs/swagger';

export class ResponseProcessIfcDto {
  @ApiProperty({
    description: 'Ruta absoluta del archivo creado en el storage',
    example: '/app/src/storage/modelo_edificio.ifc',
  })
  rutaCompleta!: string;

  @ApiProperty({
    description: 'Nombre del archivo almacenado (nom_file.ext)',
    example: 'modelo_edificio.ifc',
  })
  nombreArchivo!: string;

  @ApiProperty({
    description: 'Tamaño real del archivo en bytes',
    example: 1024,
  })
  sizeBytes!: number;

  @ApiProperty({
    description: 'Extensión normalizada del archivo',
    example: 'ifc',
  })
  ext!: string;
}
