import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import * as serviceAccount from 'firebase-key.json';
@Injectable()
export class NotificationService {
  private readonly fcm: admin.messaging.Messaging;
  constructor() {}

  async sendNotificationToGroup(
    notification: admin.messaging.NotificationMessagePayload,
    registrationTokens: string[],
  ) {
    const message: admin.messaging.MulticastMessage = {
      data: notification,
      tokens: registrationTokens,
    };

    try {
      const response = await this.fcm.sendMulticast(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
