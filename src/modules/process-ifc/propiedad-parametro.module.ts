import { Module } from '@nestjs/common';
import { PropiedadParametroRepository } from './interfaces/propiedad-parametro.interfaces';
import { PrismaPropiedadParametroRepository } from './repositories/propiedad-parametro.repository';

/**
 * Persistencia de la tabla `propiedad_parametro`.
 * Módulo separado para que `IfcProcessingModule` lo importe
 * sin crear dependencia circular con `ProcessIfcModule`.
 */
@Module({
  providers: [
    {
      provide: PropiedadParametroRepository,
      useClass: PrismaPropiedadParametroRepository,
    },
  ],
  exports: [PropiedadParametroRepository],
})
export class PropiedadParametroModule {}
