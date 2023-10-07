import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmOptionsGenerate = (config: any) =>
  ({
    type: config.DB_TYPE ?? 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    entities: ['libs/common/entities/**/*.entity{.js, .ts}'],
    synchronize: false,
    idleTimeoutMillis: 0,
    connectTimeoutMS: 0,
    extra: {
      connectionLimit: 10,
    },
    autoLoadEntities: true,
    cli: { migrationsDir: 'src/migrations/migration/' },
    useNewUrlParser: true,
    ssl: true,
  }) as TypeOrmModuleOptions;
