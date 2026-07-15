import { Global, Module } from '@nestjs/common';
import { AdminFile } from './admin-file.service';

/**
 * Módulo global de administración de archivos (admin-file).
 * Exporta `AdminFile` para inyección en cualquier servicio de la app.
 */
@Global()
@Module({
  providers: [AdminFile],
  exports: [AdminFile],
})
export class AdminFileModule {}
