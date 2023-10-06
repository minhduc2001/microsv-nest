import { Module } from '@nestjs/common';

//Libs
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { RabbitModule } from '@libs/rabbit';
import { LoggerModule } from '@libs/logger';

// Apps
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const coreModule = [LoggerModule];
const rabbitModule = [
  RabbitModule.forServerProxy(RabbitServiceName.AUTH),
  RabbitModule.forClientProxy(RabbitServiceName.USER),
];
@Module({
  imports: [...coreModule, ...rabbitModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
