import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as path from 'path';

// Libs
import { EnvModule, envService } from '@libs/env';
import { LoggerModule } from '@libs/logger';
import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { DatabaseModule } from '@libs/database';
import { LanguageModule } from '@libs/language';

// Apps
import { GatewayController } from './gateway.controller';
import { UserModule } from './modules/user.module';
import { GatewayService } from './gateway.service';
import { UploadModule } from '@libs/upload';
import { CacheModule } from '@libs/cache';
import { PaymentSystemModule } from './modules/payment-system.module';

const coreModule = [
  EnvModule,
  LoggerModule,
  DatabaseModule,
  UploadModule,
  CacheModule,
];
const rabbitModule = [
  RabbitModule.forClientProxy(RabbitServiceName.USER),
  // RabbitModule.forClientProxy(RabbitServiceName.PAYMENT_SYSTEM),
];
@Module({
  imports: [
    ...coreModule,
    ...rabbitModule,

    // LanguageModule.register(path.join(process.cwd(), '/static/i18n')),
    UserModule,
    PaymentSystemModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
