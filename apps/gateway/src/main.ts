import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationError as NestValidationError } from '@nestjs/common';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';

import { LoggerService } from '@app/logger';
import { envService } from '@app/env';
import { GatewayModule } from './gateway.module';
import { ResponseTransformInterceptor } from '@app/common/middlewares/response.interceptor';
import { HttpExceptionFilter, ValidationError } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { initSwagger } from '@app/common/swagger-ui';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GatewayModule);
  const loggerService = app.get(LoggerService);
  const logger = loggerService.getLogger();

  app.enableCors();
  app.useStaticAssets(path.join(process.cwd(), '/audio'));
  app.useStaticAssets(path.join(process.cwd(), '/uploads'));
  // app.use(`/uploads`, express.static('uploads'));
  // app.use(`/audio`, express.static('audio'));
  app.use(bodyParser.json({ limit: '200mb' }));
  app.use(cookieParser());
  app.use(morgan('dev'));

  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(loggerService));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: NestValidationError[] = []) =>
        new ValidationError(validationErrors),
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix(`api/v${envService.API_VERSION}`);
  initSwagger(app);

  await app.listen(envService.PORT, () => {
    logger.log(`server is starting on port ${envService.PORT}`);
  });
}
bootstrap();
