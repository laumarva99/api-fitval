import { NestFactory } from '@nestjs/core';
import { existsSync } from 'node:fs';
import { configureApp } from './app.config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Lee el .env solo si existe (en Render no hay .env: las variables se ponen en su web)
if (existsSync('.env')) process.loadEnvFile();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // En Render, las peticiones llegan a través de un proxy:
  // así Express ve la IP de verdad de cada cliente
  app.set('trust proxy', 1);

  configureApp(app); // prefijo /api y ValidationPipe
  // Archivos tal cual: las fotos en /uploads/...
  app.useStaticAssets('uploads', { prefix: '/uploads' });

  // Documentación en http://localhost:3000/docs
  const config = new DocumentBuilder()
    .setTitle('API de FitVal') // título de la página
    .setDescription('Planes, clases, monitores, registro y login')
    .setVersion('1.0')
    .addBearerAuth() // la API usa tokens "Bearer"
    .build();
  const document = SwaggerModule.createDocument(app, config); // lee controladores y DTO
  SwaggerModule.setup('docs', app, document); // publica la página en /docs

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
