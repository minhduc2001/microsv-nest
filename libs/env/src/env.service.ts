import { Injectable } from '@nestjs/common';
import * as ms from 'ms';
import * as ip from 'ip';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

process.env.NODE_ENV = process.env.NODE_ENV ?? 'dev';

const _process = { env: process.env };
process.env = {};

@Injectable()
export class EnvService {
  // common
  DEV = 'dev';
  TEST = 'test';
  PROD = 'prod';
  JEST = 'jest';
  NODE_ENV = _process.env.NODE_ENV;

  // system
  IP = ip.address();

  FIXED_STATUS_CODE =
    (_process.env.SENTRY_LOG ?? 'true').toLowerCase() === 'true';
  DEBUG = (_process.env.DEBUG ?? 'false').toLowerCase() !== 'false';

  PORT = _process.env.PORT ?? 8080;
  API_VERSION = '1';
  API_NAMESPACE = _process.env.API_NAMESPACE ?? 'api/v1';

  // NETWORK
  PUBLIC_IP = _process.env.PUBLIC_IP ?? this.IP;
  HOST = `http://${this.PUBLIC_IP}:${this.PORT}`;
  DOMAIN = _process.env.DOMAIN;
  API_DOC_URL = '';

  // jwt
  JWT_SECRET = _process.env.JWT_SECRET;
  JWT_RT_SECRET = _process.env.JWT_RT_SECRET;

  // google auth
  GOOGLE_CLIENT_SECRET = _process.env.GOOGLE_CLIENT_SECRET;
  GOOGLE_CLIENT_ID = _process.env.GOOGLE_CLIENT_ID;

  //facebook auth
  FACEBOOK_APP_ID = _process.env.FACEBOOK_APP_ID;
  FACEBOOK_APP_SECRET = _process.env.FACEBOOK_APP_SECRET;

  // database
  DB_TYPE = _process.env.DB_TYPE ?? 'postgres';
  DB_HOST = _process.env.DB_HOST ?? '127.0.0.1';
  DB_PORT = parseInt(_process.env.DB_PORT ?? '5432', 10);
  DB_USERNAME = _process.env.DB_USERNAME ?? 'postgres';
  DB_PASSWORD = _process.env.DB_PASSWORD ?? '';
  DB_DATABASE = _process.env.DB_DATABASE ?? '';

  // cors config
  CORS: CorsOptions = {
    origin: true,
    credentials: true,
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders:
      'content-type, authorization, accept-encoding, user-agent, accept, cache-control, connection, cookie',
    exposedHeaders:
      'X-RateLimit-Reset, set-cookie, Content-Disposition, X-File-Name',
  };

  // mailer
  EMAIL = _process.env.EMAIL;
  EMAIL_CLIENT_ID = _process.env.EMAIL_CLIENT_ID;
  EMAIL_CLIENT_SECRET = _process.env.EMAIL_CLIENT_SECRET;
  EMAIL_REDIRECT_URI = _process.env.EMAIL_REDIRECT_URI;
  EMAIL_REFRESH_TOKEN = _process.env.EMAIL_REFRESH_TOKEN;
  EMAIL_PASSWORD = _process.env.EMAIL_PASSWORD;

  // file
  MAX_FILE_SIZE = 200000000; // 10MB;
  UPLOAD_LOCATION = 'uploads';
  UPLOAD_LOCATION_AUDIO = 'audio';

  // special
  SR = {
    PRODUCT_NAME: '',
    VERSION: '',
    SIGNATURE: 'ducnm dev',
    SUPPORT: {
      URL: 'https://domain/lien-he/',
      EMAIL: 'hotro@domain.vn',
    },
  };

  // swagger
  BEARER_TEST = {};

  // rabbitmq
  RABBIT_MQ_URI = _process.env.RABBIT_MQ_URI;

  // firebase
  STOGARE_BUCKET = _process.env.STOGARE_BUCKET;

  // redis
  REDIS_HOST = _process.env.REDIS_HOST;
  REDIS_PORT = +_process.env.REDIS_PORT;
}

export const envService = new EnvService();
