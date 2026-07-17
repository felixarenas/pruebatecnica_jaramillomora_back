import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from 'prisma/prisma.module';
import { AdminFileModule } from './core/admin-file';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { UsersModule } from './modules/users/users.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { ServiciosModule } from './modules/servicios/servicios.module';
import { ProcessIfcModule } from './modules/process-ifc/process-ifc.module';
import { RedisModule } from './core/redis/redis.module';
import { IfcProcessingModule } from './core/ifc-processing/ifc-processing.module';

@Module({
  imports: [
    PrismaModule,
    AdminFileModule,
    UsersModule,
    ClientesModule,
    ServiciosModule,
    ProcessIfcModule,
    RedisModule,
    IfcProcessingModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }
