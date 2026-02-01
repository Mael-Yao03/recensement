import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Augmenter la limite de taille du body (pour les images en base64)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Activer CORS pour le frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Activer la validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend démarré sur http://localhost:${port}`);
  console.log(`📁 Images servies depuis /pictures`);
  console.log(`📊 API Membres: /api/members`);
  console.log(`👶 API Enfants: /api/children`);
}
bootstrap();
