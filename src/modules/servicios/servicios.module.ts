import { Module } from '@nestjs/common';
import { AuthModule } from 'src/core/config/auth.module/auth.module';
import { ClientesModule } from 'src/modules/clientes/clientes.module';
import { ServicioRepository } from './interfaces/servicios.interfaces';
import { PrismaServicioRepository } from './repositories/servicios.repository';
import { FindServicioService } from './services/findservicio/findservicio.service';
import { CreateServicioService } from './services/createservicio/createservicio.service';
import { UpdateServicioService } from './services/updateservicio/updateservicio.service';
import { DeleteServicioService } from './services/deleteservicio/deleteservicio.service';
import { FindServicioController } from './controllers/findservicio/findservicio.controller';
import { CreateServicioController } from './controllers/createservicio/createservicio.controller';
import { UpdateServicioController } from './controllers/updateservicio/updateservicio.controller';
import { DeleteServicioController } from './controllers/deleteservicio/deleteservicio.controller';
import { GetTiposServicioController } from './controllers/gettiposservicio/gettiposservicio.controller';
import { TipoServicioRepository } from './interfaces/tipo-servicio.interfaces';
import { PrismaTipoServicioRepository } from './repositories/tipo-servicio.repository';
import { GetTiposServicioService } from './services/gettiposservicio/gettiposservicio.service';
import { GetServiciosByClienteController } from './controllers/getserviciosbycliente/getserviciosbycliente.controller';
import { GetServiciosByClienteService } from './services/getserviciosbycliente/getserviciosbycliente.service';

@Module({
    imports: [AuthModule, ClientesModule],
    controllers: [
        FindServicioController,
        CreateServicioController,
        UpdateServicioController,
        DeleteServicioController,
        GetTiposServicioController,
        GetServiciosByClienteController,
    ],
    providers: [
        FindServicioService,
        CreateServicioService,
        UpdateServicioService,
        DeleteServicioService,
        GetTiposServicioService,
        GetServiciosByClienteService,
        {
            provide: ServicioRepository,
            useClass: PrismaServicioRepository,
        },
        {
            provide: TipoServicioRepository,
            useClass: PrismaTipoServicioRepository,
        },
    ],
    exports: [ServicioRepository],
})
export class ServiciosModule { }
