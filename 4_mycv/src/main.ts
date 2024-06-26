import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ['asdfasfd']  // string to be used to encrypt cookie value
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // stripping any extra properties given in JSON but not in DTO
    }),
  );
  await app.listen(3000);
}
bootstrap();
