import { Global, Module, OnModuleInit } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { typeOrmOptionsGenerate } from './orm.config';
import { LoggerService } from '@libs/logger';
import { envService } from '@libs/env';
import { getManager } from 'typeorm';

const typeOrmOptions: TypeOrmModuleAsyncOptions[] = [
  {
    inject: [LoggerService],
    useFactory: (loggerService: LoggerService) =>
      ({
        ...typeOrmOptionsGenerate(envService),
        synchronize: true,
        // cache: {
        //   type: 'redis',
        //   duration: config.CACHE_DB_TIMEOUT,
        //   options: {
        //     host: config.REDIS_HOST,
        //     port: config.REDIS_PORT,
        //     password: config.REDIS_PASSWORD,
        //     Db: config.REDIS_STORAGE.DB,
        //   },
        // },
        logging: true,
        // logger:
        //   config.NODE_ENV === config.JEST
        //     ? 'debug'
        //     : loggingService.getDbLogger('main_db'),
      }) as TypeOrmModuleOptions,
  },
];

@Global()
@Module({
  imports: [
    ...typeOrmOptions.map((options) => TypeOrmModule.forRootAsync(options)),
  ],
})
export class DatabaseModule implements OnModuleInit {
  onModuleInit(): any {
    void getManager().query('CREATE EXTENSION IF NOT EXISTS unaccent;');
  }
}
