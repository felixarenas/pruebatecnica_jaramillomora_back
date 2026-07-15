import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { envs, logger } from './core/config';
import { GlobalExceptionFilter } from './core/exceptions/global-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // bodyParser: false → registramos límites custom (PDFs/IFC en base64 superan el default ~100kb)
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  app.enableShutdownHooks();

  app.use(json({ limit: envs.BODY_LIMIT }));
  app.use(urlencoded({ extended: true, limit: envs.BODY_LIMIT }));

  app.setGlobalPrefix('api/v1/'); //para prefijo global
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true, //lanza error si hay campos que no estan en el DTO
      whitelist: true, //quita los campos que no estan en el DTO
    })
  );

  app.enableCors(); //para permitir peticiones desde otros dominios

  // 1. Interceptor global registrado en AppModule (APP_INTERCEPTOR)
  // 2. Activamos el Filtro de Excepciones Global (Errores)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // --- Configuración de Swagger ---
  const config = new DocumentBuilder()
    .setTitle('Sistemas de información Abaco360')
    .setDescription('Endpoints para la gestión de usuarios en el sistema de autenticación de Abaco360 y administracion de parametros de configuración del sistema')
    .setVersion('1.0')
    .addTag('tags') // Opcional
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // 'api' es el endpoint
  // --------------------------------

  await app.listen(envs.SERVER_PORT); //para iniciar el servidor
  logger.successEnv('Application is running on:', `http://${envs.HOST}:${envs.SERVER_PORT}`);
  logger.successEnv('Database is running on port:', `${envs.DB_PORT}`);
  logger.successEnv('Body size limit:', envs.BODY_LIMIT);
}
bootstrap();
