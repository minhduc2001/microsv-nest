import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EnvModule } from '@libs/env';
import { LoggerModule } from '@libs/logger';
import { ApiModule } from '@libs/api';

@Module({
  imports: [EnvModule, LoggerModule, ApiModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
