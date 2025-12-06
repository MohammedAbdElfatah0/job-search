import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
    whitelist: true,
    transform: true,
  }))
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
