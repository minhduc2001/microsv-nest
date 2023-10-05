import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { EnvModule } from '@app/env';
import { LoggerModule } from '@app/logger';
import { RabbitModule } from '@app/rabbit';
import { RabbitServiceName } from '@app/rabbit/enums/rabbit.enum';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@app/database';

const globalModule = [EnvModule, LoggerModule, DatabaseModule];
const coreModule = [];
const rabbitModule = [
  RabbitModule.forClientProxy(RabbitServiceName.AUTH),
  RabbitModule.forClientProxy(RabbitServiceName.USER),
];
@Module({
  imports: [...globalModule, ...rabbitModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
