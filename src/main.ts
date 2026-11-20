import { NestFactory } from '@nestjs/core';
import { existsSync } from 'node:fs';
import { configureApp } from './app.config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

// Lee el .env solo si existe (en Render no hay .env: las variables se ponen en su web)
if (existsSync('.env')) process.loadEnvFile();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // En Render, las peticiones llegan a través de un proxy:
  // así Express ve la IP de verdad de cada cliente
  app.set('trust proxy', 1);

  configureApp(app); // prefijo /api y ValidationPipe

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
