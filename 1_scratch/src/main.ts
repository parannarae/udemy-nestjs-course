import { NestFactory } from '@nestjs/core'  // almost only place to use `core` library
import { AppModule } from './app.module';

async function bootstrap() {
    // Start Nest module
    const app  = await NestFactory.create(AppModule)

    await app.listen(3000);
}

bootstrap()
