import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { AdminFile } from 'src/core/admin-file';
import { ProcessIfcDto } from '../../controllers/dto/int/process-ifc.dto';
import { ResponseProcessIfcDto } from '../../controllers/dto/out/response-process-ifc.dto';
import { ProcessIfcRepository } from '../../interfaces/processifc.interfaces';
import { IfcProcessingService } from 'src/core/ifc-processing/ifc-processing.service';
import { IfcProcessByNamePayload, ProcessIfcResult } from 'src/core/ifc-processing/interfaces/ifc-processing.interface';
import { RedisService } from 'src/core/redis/redis.service';

/**
 * Caso de uso: decodificar un archivo IFC (u otra extensión) desde base64
 * y persistirlo en el storage de la aplicación mediante AdminFile.
 */
@Injectable()
export class ProcessIfcService {
  /** Carpeta storage de la aplicación (`src/storage`) */
  private readonly storagePath = path.join(process.cwd(), 'src', 'storage');

  constructor(
    private readonly adminFile: AdminFile,
    private readonly processIfcRepository: ProcessIfcRepository,
    private readonly ifcProcessingService: IfcProcessingService,
    private readonly redisService: RedisService,
  ) { }

  async process(dto: ProcessIfcDto): Promise<ResponseProcessIfcDto> {
    const result = await this.adminFile.create(
      {
        nom_file: dto.nom_file,
        ext: dto.ext,
        size: dto.size,
        base64: dto.base64,
      },
      this.storagePath,
    );

    if (!result.status) {
      throw new NotFoundException(result.message);
    }

    await this.processIfcRepository.create({
      rutaCompleta: result.rutaCompleta,
      nombreArchivo: result.nombreArchivo,
    });

    return {
      rutaCompleta: result.rutaCompleta,
      nombreArchivo: result.nombreArchivo,
      sizeBytes: result.sizeBytes,
      ext: result.ext,
    };
  }

  async processPropertySetsIfcFile(payload: IfcProcessByNamePayload): Promise<ProcessIfcResult> {

    const nom_file = payload.nom_file;

    if (!await this.adminFile.existFile(this.storagePath, nom_file)) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const data = await this.redisService.get<ProcessIfcResult>(`ifc_process_${nom_file}`);

    if (data) {
      return data;
    }

    await this.ifcProcessingService.onModuleInit();

    const result = await this.ifcProcessingService.processIfcFile(payload);

    const elementsDB = await this.getElementsDBByIfcProcess(result.data.modelID);

    result.data.elementsDB = elementsDB;

    await this.redisService.set(`ifc_process_${nom_file}`, result, 60 * 60 * 24);

    return result;
  }

  async resetCache(): Promise<void> {
    await this.redisService.reset();
  }

  private async getElementsDBByIfcProcess(id_model: number): Promise<any> {
    const elementsDBByIfcProcessNivel = await this.processIfcRepository.getElementsDBByIfcProcessNivel(id_model);
    const elementsDBByIfcProcessCategory = await this.processIfcRepository.getElementsDBByIfcProcessCategory(id_model);

    return {
      "nivel": elementsDBByIfcProcessNivel,
      "categoria": elementsDBByIfcProcessCategory,
    };
  }
}
