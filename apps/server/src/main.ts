import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({
    origin: [
      configService.getOrThrow('APP_URL'),
      configService.getOrThrow('API_URL'),
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
