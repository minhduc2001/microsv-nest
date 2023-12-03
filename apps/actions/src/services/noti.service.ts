import { Notification } from '@libs/common/entities/notification/notification.entity';
import { BaseService } from '@libs/common/services/base.service';
import { makeUUID } from '@libs/common/utils/function';
import { NotificationService } from '@libs/notification';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { getMessaging } from 'firebase-admin/messaging';
import { getApp } from 'firebase-admin/app';
import {
  IFirebaseSendNotification,
  IFirebaseSendNotificationGroupDevices,
} from '@libs/notification/notification.interface';
import { NOTIFICATION_PLATFORM } from '@libs/notification/notification.enum';
import { BadException } from '@libs/common';

@Injectable()
export class NotiService extends BaseService<Notification> {
  constructor(
    @InjectRepository(Notification)
    protected readonly repository: Repository<Notification>,
    private readonly notificationService: NotificationService,
  ) {
    super(repository);
  }

  async save(userId: number, token: string) {
    try {
      const check = this.repository.create({
        userId: userId,
        notification_key_name: makeUUID(userId.toString()),
        registerIds: [token],
      });

      const notification_key = await this.notificationService.addDeviceGroup({
        notification_key_name: check.notification_key_name,
        registerIds: check.registerIds,
      });

      if (notification_key) {
        check.notification_key = notification_key;
        await check.save();
      }
      return check;
    } catch (error) {
      throw new BadException({ message: error.message });
    }
  }

  async updateDeviceGroup(userId: number, token: string) {
    try {
      let check = await this._getToken(userId);
      if (!check) check = await this.save(userId, token);
      if (check.registerIds.includes(token)) return;
      check.registerIds.push(token);

      const notification_key = await this.notificationService.updateDeviceGroup(
        {
          notification_key_name: check.notification_key_name,
          notification_key: check.notification_key,
          registrationTokens: check.registerIds,
        },
      );

      if (notification_key) {
        await check.save();
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async sendGroupDevice(data: IFirebaseSendNotificationGroupDevices) {
    const app = getApp();

    const payload = {
      notification: {
        title: 'New message from John Doe',
        body: 'You have a new message from John Doe',
        icon: 'path/to/icon',
        click_action: '#',
      },
      data: {
        message_id: '123',
        sender_name: 'John Doe',
        sender_avatar: 'path/to/avatar',
        message_content: 'Hello, how are you?',
      },
    };

    return getMessaging(app).sendToDeviceGroup(data.notification_key, payload);
  }

  async send(data: IFirebaseSendNotification) {
    const app = getApp();
    const payload = this.notificationService.createPayload(data, [
      NOTIFICATION_PLATFORM.web,
      NOTIFICATION_PLATFORM.android,
    ]);
    return getMessaging(app).send(payload);
  }

  private async _getToken(userId: number) {
    return this.repository.findOne({
      where: { userId },
    });
  }
}
