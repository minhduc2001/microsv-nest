import { LoggerModule } from '@libs/logger';
import { DatabaseModule } from '@libs/database';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@libs/common/entities/user/user.entity';
import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    TypeOrmModule.forFeature([User]),
    RabbitModule.forServerProxy(RabbitServiceName.USER),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
