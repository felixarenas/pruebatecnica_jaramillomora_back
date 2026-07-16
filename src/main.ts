import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as path from 'path';
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

  // CORS antes de estáticos: el visor IFC (Angular :4200) hace fetch a /storage/*
  const corsOrigins = envs.CORS_ORIGINS;
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  app.use(json({ limit: envs.BODY_LIMIT }));
  app.use(urlencoded({ extended: true, limit: envs.BODY_LIMIT }));

  // serve-static responde antes del CORS de Nest; cabeceras explícitas para /storage
  app.use('/storage', (req, res, next) => {
    const requestOrigin = req.headers.origin;
    if (requestOrigin && corsOrigins.includes(requestOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
      res.setHeader('Vary', 'Origin');
    } else if (corsOrigins.length > 0) {
      res.setHeader('Access-Control-Allow-Origin', corsOrigins[0]);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Archivos IFC (y otros) del storage accesibles vía HTTP: /storage/<archivo>
  app.useStaticAssets(path.join(process.cwd(), 'src', 'storage'), {
    prefix: '/storage/',
  });

  app.setGlobalPrefix('api/v1/'); //para prefijo global
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true, //lanza error si hay campos que no estan en el DTO
      whitelist: true, //quita los campos que no estan en el DTO
    })
  );

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
  logger.successEnv('CORS origins:', corsOrigins.join(', '));
  logger.successEnv('Storage público en:', `http://${envs.HOST}:${envs.SERVER_PORT}/storage`);
}
bootstrap();
