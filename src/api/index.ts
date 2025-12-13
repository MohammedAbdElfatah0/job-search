import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import helmet from 'helmet';
import { AppModule } from '../app.module';
import { TransformInterceptor } from '../common/interceptor';

const server = express();
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      { cors: true },
    );

    app.use(helmet());

    app.useGlobalPipes(
      new ValidationPipe({
        stopAtFirstError: true,
        whitelist: true,
        transform: true,
      }),
    );

    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init(); // ❗ بدل listen
    cachedApp = server;
  }

  return cachedApp;
}

export default bootstrap();
