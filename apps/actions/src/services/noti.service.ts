import { Notification } from '@libs/common/entities/notification/notification.entity';
import { BaseService } from '@libs/common/services/base.service';
import { makeUUID } from '@libs/common/utils/function';
import { NotificationService } from '@libs/notification';
import { Injectable, Query } from '@nestjs/common';
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
import { Noti } from '@libs/common/entities/notification/noti.entity';
import { ListDto } from '@libs/common/dtos/common.dto';
import { PaginateConfig } from '@libs/common/services/paginate';
import { ListNotiDto } from '@libs/common/dtos/noti.dto';
import { User } from '@libs/common/entities/user/user.entity';

@Injectable()
export class NotiService extends BaseService<Noti> {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Noti)
    protected readonly repository: Repository<Noti>,
    private readonly notificationService: NotificationService,
  ) {
    super(repository);
  }

  async save(userId: number, token: string) {
    try {
      const check = this.notificationRepository.create({
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

    const message_id = `${new Date().getTime()}`;

    const dataFirebase = await this.notificationRepository.findOne({
      where: { userId: data.userId },
    });

    if (!dataFirebase) return null;

    const payload = {
      notification: {
        title: data?.notification?.title || 'New message from System',
        body: data?.notification?.body || 'You have a new message from System',
        icon: 'path/to/icon',
        click_action: '#',
      },
      data: {
        message_id: message_id,
        sender_name: data.data.sender_name,
        sender_avatar: `${data?.data?.sender_avatar}`,
        message_content: `${data.data.message_content}`,
      },
    };

    await this.repository.save({
      userId: data.userId,
      messageId: message_id,
      messageContent: data.data.message_content,
    });

    return getMessaging(app).sendToDeviceGroup(
      dataFirebase.notification_key,
      payload,
    );
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
    return this.notificationRepository.findOne({
      where: { userId },
    });
  }

  async find(query: ListNotiDto) {
    const config: PaginateConfig<Noti> = {
      sortableColumns: ['id'],
      where: { userId: query.user.id },
    };

    return this.listWithPage(query, config);
  }

  async handleView(id: number, user: User) {
    const noti = await this.repository.findOne({
      where: {
        userId: user.id,
        id,
      },
    });

    if (!noti) return null;
    noti.isView = true;
    return noti.save();
  }
}
