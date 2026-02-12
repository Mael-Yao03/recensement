import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import express from 'express';

const server = express();
server.use(json({ limit: '50mb' }));
server.use(urlencoded({ extended: true, limit: '50mb' }));

let appInitialized = false;

async function bootstrap() {
  if (appInitialized) {
    return;
  }
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  await app.init();
  appInitialized = true;
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  return server(req, res);
}
