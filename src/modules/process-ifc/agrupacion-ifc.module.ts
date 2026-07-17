import { Module } from '@nestjs/common';
import { AgrupacionIfcRepository } from './interfaces/agrupacion-ifc.interfaces';
import { PrismaAgrupacionIfcRepository } from './repositories/agrupacion-ifc.repository';

/**
 * Persistencia de la tabla `agrupacion_ifc`.
 * Módulo separado para que `IfcProcessingModule` lo importe
 * sin crear dependencia circular con `ProcessIfcModule`.
 */
@Module({
  providers: [
    {
      provide: AgrupacionIfcRepository,
      useClass: PrismaAgrupacionIfcRepository,
    },
  ],
  exports: [AgrupacionIfcRepository],
})
export class AgrupacionIfcModule {}
