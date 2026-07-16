import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { AdminFile } from 'src/core/admin-file';
import { ProcessIfcDto } from '../../controllers/dto/int/process-ifc.dto';
import { ResponseProcessIfcDto } from '../../controllers/dto/out/response-process-ifc.dto';
import { ProcessIfcRepository } from '../../interfaces/processifc.interfaces';

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
  ) {}

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
}
