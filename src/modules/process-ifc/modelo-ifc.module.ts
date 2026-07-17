import { Module } from '@nestjs/common';
import { ModeloIfcRepository } from './interfaces/modelo-ifc.interfaces';
import { PrismaModeloIfcRepository } from './repositories/modelo-ifc.repository';

/**
 * Persistencia de la tabla `modelo_ifc`.
 * Módulo separado para que `IfcProcessingModule` lo importe
 * sin crear dependencia circular con `ProcessIfcModule`.
 */
@Module({
  providers: [
    {
      provide: ModeloIfcRepository,
      useClass: PrismaModeloIfcRepository,
    },
  ],
  exports: [ModeloIfcRepository],
})
export class ModeloIfcModule {}
