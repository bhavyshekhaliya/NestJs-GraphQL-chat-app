import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  // for the class-validator and class-transformer
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true, // This enables class-transformer
      transformOptions: {
        enableImplicitConversion: true, // This allows class-transformer to convert types implicitly
      }, 
    })
  )

  const configService = app.get(ConfigService);
  
  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
