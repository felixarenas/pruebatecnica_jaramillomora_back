import { Injectable } from '@nestjs/common';
import { envs } from 'src/core/config';
import { ResponseFileIfcDto } from '../../controllers/dto/out/response-file-ifc.dto';
import { RefFileMapper } from '../../controllers/mappers/ref-file.mapper';
import { ProcessIfcRepository } from '../../interfaces/processifc.interfaces';

/**
 * Caso de uso: listar todos los archivos IFC referenciados en `ref_files`
 * con URL HTTP pública para consumo en navegador o motores 3D.
 */
@Injectable()
export class GetFileIfcAllService {
  constructor(private readonly processIfcRepository: ProcessIfcRepository) {}

  async getFileIfcAll(): Promise<ResponseFileIfcDto[]> {
    const entities = await this.processIfcRepository.findAll();
    const baseUrl = `http://${envs.HOST}:${envs.SERVER_PORT}`;

    return RefFileMapper.toResponseDtoList(entities, baseUrl);
  }
}
