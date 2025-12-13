import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { VercelRequest, VercelResponse } from '@vercel/node';

let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    await app.init();
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await bootstrap();
  const server = app.getHttpServer();
  
  // Handle the request
  server.emit('request', req, res);
}
