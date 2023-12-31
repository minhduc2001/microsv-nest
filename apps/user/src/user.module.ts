import { LoggerModule } from '@libs/logger';
import { DatabaseModule } from '@libs/database';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@libs/common/entities/user/user.entity';
import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Profile } from '@libs/common/entities/user/profile.entity';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { MailerModule } from '@libs/mailer';
import { CacheModule } from '@libs/cache';
import { Notification } from '@libs/common/entities/notification/notification.entity';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    TypeOrmModule.forFeature([User, Profile]),
    RabbitModule.forServerProxy(RabbitServiceName.USER),
    RabbitModule.forClientProxy(RabbitServiceName.ACTIONS),
    MailerModule,
    CacheModule,
  ],
  controllers: [UserController, ProfileController],
  providers: [UserService, ProfileService],
})
export class UserModule {}
