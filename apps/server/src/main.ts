import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://api-organiza-fr6u.onrender.com/',
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
