import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { RabbitServiceName } from '@app/rabbit/enums/rabbit.enum';
import { RabbitModule } from '@app/rabbit';

@Module({
  imports: [
    RabbitModule.forServerProxy(RabbitServiceName.AUTH),
    RabbitModule.forClientProxy(RabbitServiceName.USER),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
