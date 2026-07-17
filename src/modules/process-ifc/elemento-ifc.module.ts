import { Module } from '@nestjs/common';
import { ElementoIfcRepository } from './interfaces/elemento-ifc.interfaces';
import { PrismaElementoIfcRepository } from './repositories/elemento-ifc.repository';

/**
 * Persistencia de la tabla `elemento_ifc`.
 * Módulo separado para que `IfcProcessingModule` lo importe
 * sin crear dependencia circular con `ProcessIfcModule`.
 */
@Module({
  providers: [
    {
      provide: ElementoIfcRepository,
      useClass: PrismaElementoIfcRepository,
    },
  ],
  exports: [ElementoIfcRepository],
})
export class ElementoIfcModule {}
