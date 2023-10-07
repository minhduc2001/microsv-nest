import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';

@Module({
  imports: [RabbitModule.forClientProxy(RabbitServiceName.USER)],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
