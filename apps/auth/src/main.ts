import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError as NestValidationError } from '@nestjs/common';

// Libs
import { LoggerService } from '@libs/logger';
import {
  CustomRpcExceptionFilter,
  HttpExceptionFilter,
  ValidationError,
} from '@libs/common';
import { RABBIT_SERVICE_OPTIONS } from '@libs/rabbit/constants/constant';
import { ResponseTransformInterceptor } from '@libs/common/middlewares/response.interceptor';

// Apps
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const loggerService = app.get(LoggerService);

  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new CustomRpcExceptionFilter(new LoggerService()));
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
