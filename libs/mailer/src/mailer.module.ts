import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerHelper } from './mailer.helper';

@Module({
  providers: [MailerService, MailerHelper],
  exports: [MailerService, MailerHelper],
})
export class MailerModule {}
