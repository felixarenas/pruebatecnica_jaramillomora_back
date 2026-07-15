import { Module } from '@nestjs/common';
import { AuthModule } from 'src/core/config/auth.module/auth.module';
import { ClienteRepository } from './interfaces/clientes.interfaces';
import { PrismaClienteRepository } from './repositories/clientes.repository';
import { FindClienteService } from './services/findcliente/findcliente.service';
import { CreateClienteService } from './services/createcliente/createcliente.service';
import { UpdateClienteService } from './services/updatecliente/updatecliente.service';
import { DeleteClienteService } from './services/deletecliente/deletecliente.service';
import { FindClienteController } from './controllers/findcliente/findcliente.controller';
import { CreateClienteController } from './controllers/createcliente/createcliente.controller';
import { UpdateClienteController } from './controllers/updatecliente/updatecliente.controller';
import { DeleteClienteController } from './controllers/deletecliente/deletecliente.controller';
import { GetTiposIdentityController } from './controllers/gettiposidentity/gettiposidentity.controller';
import { IdentityTypeRepository } from './interfaces/identity-type.interfaces';
import { PrismaIdentityTypeRepository } from './repositories/identity-type.repository';
import { GetTiposIdentityService } from './services/gettiposidentity/gettiposidentity.service';

@Module({
    imports: [AuthModule],
    controllers: [
        FindClienteController,
        CreateClienteController,
        UpdateClienteController,
        DeleteClienteController,
        GetTiposIdentityController,
    ],
    providers: [
        FindClienteService,
        CreateClienteService,
        UpdateClienteService,
        DeleteClienteService,
        GetTiposIdentityService,
        {
            provide: ClienteRepository,
            useClass: PrismaClienteRepository,
        },
        {
            provide: IdentityTypeRepository,
            useClass: PrismaIdentityTypeRepository,
        },
    ],
    exports: [ClienteRepository],
})
export class ClientesModule { }
