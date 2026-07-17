import { Global, Module } from '@nestjs/common';
import { AgrupacionIfcModule } from 'src/modules/process-ifc/agrupacion-ifc.module';
import { CantidadIfcModule } from 'src/modules/process-ifc/cantidad-ifc.module';
import { ElementoIfcModule } from 'src/modules/process-ifc/elemento-ifc.module';
import { ModeloIfcModule } from 'src/modules/process-ifc/modelo-ifc.module';
import { PropiedadParametroModule } from 'src/modules/process-ifc/propiedad-parametro.module';
import { PropertySetIfcModule } from 'src/modules/process-ifc/property-set-ifc.module';
import { IfcProcessingService } from './ifc-processing.service';

/**
 * Módulo global para el procesamiento de archivos IFC.
 * Exporta `IfcProcessingService` para inyección en cualquier servicio de la app.
 */
@Global()
@Module({
    imports: [
        ModeloIfcModule,
        AgrupacionIfcModule,
        ElementoIfcModule,
        PropertySetIfcModule,
        PropiedadParametroModule,
        CantidadIfcModule,
    ],
    providers: [IfcProcessingService],
    exports: [IfcProcessingService],
})
export class IfcProcessingModule { }
