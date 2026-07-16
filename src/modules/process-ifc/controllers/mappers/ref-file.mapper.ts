import * as path from 'path';
import { RefFileEntity } from '../../entities/ref-file.entity';
import { ResponseFileIfcDto } from '../dto/out/response-file-ifc.dto';

export class RefFileMapper {
  static toResponseDto(entity: RefFileEntity, baseUrl: string): ResponseFileIfcDto {
    const fileName = path.basename(entity.pathStorage);
    const url = `${baseUrl.replace(/\/$/, '')}/storage/${encodeURIComponent(fileName)}`;

    return {
      nom_file: entity.nomFile,
      url,
    };
  }

  static toResponseDtoList(
    entities: RefFileEntity[],
    baseUrl: string,
  ): ResponseFileIfcDto[] {
    return entities.map((entity) => this.toResponseDto(entity, baseUrl));
  }
}
