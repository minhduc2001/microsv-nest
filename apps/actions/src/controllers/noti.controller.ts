import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, Get } from '@nestjs/common';
import { NotiService } from '../services/noti.service';
import { ACTIONS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import {
  IFirebaseSendNotification,
  IFirebaseSendNotificationGroupDevices,
} from '@libs/notification/notification.interface';
import { ListNotiDto } from '@libs/common/dtos/noti.dto';

@Controller()
export class NotiController {
  constructor(private readonly service: NotiService) {}

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.NOTI.CREATE)
  async create(
    @Payload('userId') userId: number,
    @Payload('token') token: string,
  ) {
    return this.service.save(userId, token);
  }

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.NOTI.UPDATE)
  async update(
    @Payload('userId') userId: number,
    @Payload('token') token: string,
  ) {
    return this.service.updateDeviceGroup(userId, token);
  }

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.NOTI.SEND)
  async send(@Payload() payload: IFirebaseSendNotification) {
    return this.service.send(payload);
  }

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.NOTI.SEND_GROUP)
  async sendGroup(@Payload() payload: IFirebaseSendNotificationGroupDevices) {
    return this.service.sendGroupDevice(payload);
  }

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.NOTI.GET_NOTI_BY_USER)
  async find(@Payload() query: ListNotiDto) {
    return this.service.find(query);
  }

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.NOTI.IS_VIEWS)
  async handleview(@Payload() payload: any) {
    return this.service.handleView(payload.id, payload.user);
  }
}
