import { envService } from '@libs/env';
import { Injectable } from '@nestjs/common';
import {
  IAddGroupDevices,
  IFirebaseSendNotification,
  IResponseFirebase,
  IUpdateGroupDevices,
} from './notification.interface';
import * as firebase from 'firebase-admin';
import * as serviceAccount from 'firebase-key.json';
import { TokenMessage } from 'firebase-admin/messaging';
import { NOTIFICATION_PLATFORM } from './notification.enum';
import { ApiService } from '@libs/api';

@Injectable()
export class NotificationService {
  constructor(private readonly apiService: ApiService) {
    firebase.initializeApp({
      credential: firebase.credential.cert(
        serviceAccount as firebase.ServiceAccount,
      ),
    });
  }

  async addDeviceGroup(data: IAddGroupDevices): Promise<string> {
    const options = {
      url: 'https://fcm.googleapis.com/fcm/notification',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${envService.SERVER_KEY}`,
        project_id: envService.SENDER_ID,
      },
      json: {
        operation: 'create',
        notification_key_name: data.notification_key_name,
        registration_ids: data.registerIds,
      },
    };

    const response: IResponseFirebase =
      await this.apiService.post<IResponseFirebase>(options.url, options.json, {
        headers: options.headers,
      });

    return response.notification_key;
  }

  async updateDeviceGroup(data: IUpdateGroupDevices): Promise<string> {
    const options = {
      url: 'https://fcm.googleapis.com/fcm/notification',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${envService.SERVER_KEY}`,
        project_id: envService.SENDER_ID,
      },
      json: {
        operation: 'add',
        notification_key_name: data.notification_key_name,
        notification_key: data.notification_key,
        registration_ids: data.registrationTokens,
      },
    };

    const response: IResponseFirebase =
      await this.apiService.post<IResponseFirebase>(options.url, options.json, {
        headers: options.headers,
      });

    return response.notification_key;
  }

  createPayload(
    data: IFirebaseSendNotification,
    platforms: NOTIFICATION_PLATFORM[],
  ) {
    const payload: TokenMessage = {
      notification: {
        title: data.title,
        body: data.body,
      },
      token: data.token,
    };
    platforms.forEach((platform) => {
      switch (platform) {
        case NOTIFICATION_PLATFORM.web:
          payload.webpush = {
            data: {
              actionDetail: 'openDetail',
            },
          };
          break;
        case NOTIFICATION_PLATFORM.android:
          payload.android = {
            data: {
              actionDetail: 'openDetail',
            },
          };
          break;
      }
    });

    return payload;
  }
}
