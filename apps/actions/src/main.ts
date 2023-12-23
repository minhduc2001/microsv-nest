import { NestFactory } from '@nestjs/core';
import { ActionsModule } from './actions.module';
import { LoggerService } from '@libs/logger';
import { CustomRpcExceptionFilter, ValidationError } from '@libs/common';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError as NestValidationError } from 'class-validator';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@libs/rabbit/constants/constant';

async function bootstrap() {
  const app = await NestFactory.create(ActionsModule);
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
