import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import {
  AdminFileCreateResult,
  FilePayload,
} from './interfaces/file-payload.interface';

/**
 * Librería transversal para crear archivos en disco a partir de un payload base64.
 *
 * Inyectable en cualquier servicio de la aplicación vía `AdminFileModule`.
 *
 * @example
 * ```typescript
 * await this.adminFile.create(datoJson, '/ruta/destino');
 * ```
 */
@Injectable()
export class AdminFile {
  private readonly logger = new Logger(AdminFile.name);

  /**
   * Decodifica el contenido base64 y crea el archivo en `rutaArchivo`
   * con el nombre `nom_file.ext` del payload.
   *
   * @param datoJson Payload con nom_file, ext, size y base64
   * @param rutaArchivo Directorio destino (se crea si no existe)
   */
  async create(datoJson: FilePayload, rutaArchivo: string): Promise<AdminFileCreateResult> {
    this.assertPayload(datoJson);

    const ext = this.normalizeExt(datoJson.ext);
    const safeName = this.sanitizeFileName(datoJson.nom_file);
    const nombreArchivo = `${safeName}.${ext}`;
    const destinoDir = path.resolve(rutaArchivo);
    const rutaCompleta = path.join(destinoDir, nombreArchivo);

    this.ensurePathInsideDirectory(destinoDir, rutaCompleta);

    if (await this.valideExistFile(destinoDir, nombreArchivo)) {
      return {
        status: false,
        message: `El archivo ${nombreArchivo} ya existe en la ruta ${destinoDir}`,
        rutaCompleta: '',
        nombreArchivo: '',
        sizeBytes: 0,
        ext: '',
      };
    }

    const buffer = this.decodeBase64(datoJson.base64);

    if (buffer.length === 0) {
      return {
        status: false,
        message: 'El contenido base64 del archivo está vacío',
        rutaCompleta: '',
        nombreArchivo: '',
        sizeBytes: 0,
        ext: '',
      };
    }

    try {
      await fs.mkdir(destinoDir, { recursive: true });
      await fs.writeFile(rutaCompleta, buffer);

      this.logger.log(`Archivo creado: ${rutaCompleta} (${buffer.length} bytes)`);

      return {
        status: true,
        message: 'Archivo creado correctamente',
        rutaCompleta,
        nombreArchivo,
        sizeBytes: buffer.length,
        ext,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`No se pudo crear el archivo en ${rutaCompleta}: ${message}`);
      return {
        status: false,
        message: `No se pudo crear el archivo en el storage: ${message}`,
        rutaCompleta: '',
        nombreArchivo: '',
        sizeBytes: 0,
        ext: '',
      };
    }
  }

  /**
   * Valida si existe un archivo en una ruta específica.
   * @param ruta Ruta del archivo.
   * @param fileName Nombre del archivo.
   * @returns `true` si existe el archivo, `false` si no existe.
   */
  private async valideExistFile(ruta: string, fileName: string): Promise<boolean> {
    try {
      await fs.access(path.join(ruta, fileName));
      return true;
    } catch (error) {
      return false;
    }
  }

  private assertPayload(datoJson: FilePayload): void {
    if (!datoJson) {
      throw new BadRequestException('El payload del archivo es requerido');
    }

    if (!datoJson.nom_file?.trim()) {
      throw new BadRequestException('El campo nom_file es requerido');
    }

    if (!datoJson.ext?.trim()) {
      throw new BadRequestException('El campo ext es requerido');
    }

    if (datoJson.size == null || Number.isNaN(Number(datoJson.size)) || Number(datoJson.size) < 0) {
      throw new BadRequestException('El campo size debe ser un número válido mayor o igual a 0');
    }

    if (!datoJson.base64?.trim()) {
      throw new BadRequestException('El campo base64 es requerido');
    }
  }

  private normalizeExt(ext: string): string {
    const normalized = ext.trim().replace(/^\.+/, '').toLowerCase();

    if (!normalized || !/^[a-z0-9]+$/i.test(normalized)) {
      throw new BadRequestException('La extensión del archivo no es válida');
    }

    return normalized;
  }

  private sanitizeFileName(nomFile: string): string {
    const base = path.basename(nomFile.trim());
    const withoutExt = base.replace(/\.[^.]+$/, '');
    const safe = withoutExt.replace(/[^a-zA-Z0-9._-]/g, '_');

    if (!safe) {
      throw new BadRequestException('El nombre del archivo no es válido');
    }

    return safe;
  }

  private decodeBase64(raw: string): Buffer {
    const cleaned = raw.trim().replace(/^data:[^;]+;base64,/i, '');

    try {
      return Buffer.from(cleaned, 'base64');
    } catch {
      throw new BadRequestException('El contenido base64 no es válido');
    }
  }

  private ensurePathInsideDirectory(directory: string, filePath: string): void {
    const resolvedDir = path.resolve(directory);
    const resolvedFile = path.resolve(filePath);

    if (!resolvedFile.startsWith(resolvedDir + path.sep) && resolvedFile !== resolvedDir) {
      throw new BadRequestException('Ruta de archivo no permitida');
    }
  }
}
