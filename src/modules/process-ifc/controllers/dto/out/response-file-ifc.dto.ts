import { ApiProperty } from '@nestjs/swagger';

export class ResponseFileIfcDto {
  @ApiProperty({
    description: 'Nombre del archivo almacenado',
    example: 'modelo_edificio.ifc',
  })
  nom_file!: string;

  @ApiProperty({
    description:
      'URL HTTP pública del archivo para cargar en navegador o librerías 3D (p. ej. Open Engine)',
    example: 'http://localhost:3050/storage/modelo_edificio.ifc',
  })
  url!: string;
}
