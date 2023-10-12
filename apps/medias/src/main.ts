import { NestFactory } from '@nestjs/core';
import { MediasModule } from './medias.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@libs/rabbit/constants/constant';
import { ValidationError as NestValidationError } from 'class-validator';
import { CustomRpcExceptionFilter, ValidationError } from '@libs/common';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from '@libs/logger';

async function bootstrap() {
  const app = await NestFactory.create(MediasModule);
  const loggerService = app.get(LoggerService);

  app.useGlobalFilters(new CustomRpcExceptionFilter(loggerService));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: NestValidationError[] = []) =>
        new ValidationError(validationErrors),
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>(
    app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS),
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
}
bootstrap();
