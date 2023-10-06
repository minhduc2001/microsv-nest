import { envService } from '@libs/env';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as excRpc from '@libs/common/api';

@Injectable()
export class MailerService {
  private transporter: any;
  constructor() {
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

  async sendMail(to: string, subject: string, body: string) {
    try {
      const mailOptions = {
        from: envService.EMAIL,
        to,
        subject,
        html: body,
      };
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (e) {
      throw new excRpc.BadRequest({ message: e.message });
    }
  }
}
