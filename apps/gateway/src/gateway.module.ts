import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { EnvModule } from '@libs/env';
import { LoggerModule } from '@libs/logger';
import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';

const globalModule = [EnvModule, LoggerModule];
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
