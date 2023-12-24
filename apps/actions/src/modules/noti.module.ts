import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotiController } from '../controllers/noti.controller';
import { NotiService } from '../services/noti.service';
import { Notification } from '@libs/common/entities/notification/notification.entity';
import { NotificationModule } from '@libs/notification';
import { Noti } from '@libs/common/entities/notification/noti.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Noti]), NotificationModule],
  controllers: [NotiController],
  providers: [NotiService],
})
export class NotiModule {}
