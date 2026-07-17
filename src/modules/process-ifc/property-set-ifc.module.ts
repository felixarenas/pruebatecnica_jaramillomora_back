import { Module } from '@nestjs/common';
import { PropertySetIfcRepository } from './interfaces/property-set-ifc.interfaces';
import { PrismaPropertySetIfcRepository } from './repositories/property-set-ifc.repository';

/**
 * Persistencia de la tabla `property_set`.
 * Módulo separado para que `IfcProcessingModule` lo importe
 * sin crear dependencia circular con `ProcessIfcModule`.
 */
@Module({
  providers: [
    {
      provide: PropertySetIfcRepository,
      useClass: PrismaPropertySetIfcRepository,
    },
  ],
  exports: [PropertySetIfcRepository],
})
export class PropertySetIfcModule {}
