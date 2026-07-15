import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from 'prisma/prisma.module';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { UsersModule } from './modules/users/users.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { ServiciosModule } from './modules/servicios/servicios.module';
import { RedisModule } from './core/redis/redis.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ClientesModule,
    ServiciosModule,
    RedisModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
