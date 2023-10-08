import { envService } from '@libs/env';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as excRpc from '@libs/common/api';
import { MailerHelper } from './mailer.helper';

interface IMail {
  to: string;
  subject: string;
  body: Record<string, any>;
  template: string;
}

@Injectable()
export class MailerService {
  private transporter: any;
  constructor(private mailerHelper: MailerHelper) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: envService.EMAIL,
        pass: envService.EMAIL_PASSWORD,
      },
    });
  }

  async sendMail(info: IMail) {
    const body = await this.mailerHelper.getTemplateEmail(
      info.body,
      info.template,
    );
    try {
      const mailOptions = {
        from: envService.EMAIL,
        to: info.to,
        subject: info.subject,
        html: body,
      };
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (e) {
      throw new excRpc.BadRequest({ message: e.message });
    }
  }
}
