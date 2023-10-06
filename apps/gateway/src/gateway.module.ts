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
import { JwtStrategy } from './auth/strategies/jwt.stategy';

const coreModule = [EnvModule, LoggerModule, DatabaseModule];
const rabbitModule = [RabbitModule.forClientProxy(RabbitServiceName.USER)];
@Module({
  imports: [
    ...coreModule,
    ...rabbitModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envService.JWT_SECRET,
      signOptions: { expiresIn: '10d' },
    }),
    LanguageModule.register(path.join(process.cwd(), '/static/i18n')),
  ],
  controllers: [GatewayController],
  providers: [JwtStrategy],
})
export class GatewayModule {}
