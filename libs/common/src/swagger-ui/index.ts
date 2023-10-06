import { envService } from '@libs/env';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function initSwagger(app: INestApplication) {
  if (envService.NODE_ENV === envService.PROD) return;

  const SR = envService.SR;
  const configSwagger = new DocumentBuilder()
    .setTitle(SR.PRODUCT_NAME)
    .setDescription('Description document for Rest API')
    .setVersion(SR.VERSION)
    .setContact(SR.SIGNATURE, SR.SUPPORT.URL, SR.SUPPORT.EMAIL)
    .setExternalDoc('Backend overview', envService.HOST + '/overview')
    .setLicense('Postman API Docs', envService.API_DOC_URL)
    .addServer('http://localhost:' + String(envService.PORT), 'Localhost')
    .addServer(envService.HOST, 'Dev server')
    .addServer(envService.PUBLIC_IP, 'Current server throw nginx')
    .addServer('null', 'Ngrok server')
    .addServer('null', 'Public server')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/v1/apidoc', app, document);
}

export * from './swagger.decorator';
