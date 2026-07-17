import { Module } from '@nestjs/common';
import { CantidadIfcRepository } from './interfaces/cantidad-ifc.interfaces';
import { PrismaCantidadIfcRepository } from './repositories/cantidad-ifc.repository';

/**
 * Persistencia de la tabla `cantidad_ifc`.
 * Módulo separado para que `IfcProcessingModule` lo importe
 * sin crear dependencia circular con `ProcessIfcModule`.
 */
@Module({
  providers: [
    {
      provide: CantidadIfcRepository,
      useClass: PrismaCantidadIfcRepository,
    },
  ],
  exports: [CantidadIfcRepository],
})
export class CantidadIfcModule {}
