import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// libs
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ApiCreateOperation, ApiTagsAndBearer } from '@libs/common/swagger-ui';

// apps
import { Auth } from './auth/decorators/auth.decorator';
import { Public } from './auth/decorators/public.decorator';
import { ACTIONS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { IFirebaseSendNotificationGroupDevices } from '@libs/notification/notification.interface';

@ApiTagsAndBearer('Gateway')
@Controller()
@Auth()
export class GatewayController {
  constructor(
    @Inject(RabbitServiceName.USER) private userClientProxy: ClientProxy,
    @Inject(RabbitServiceName.ACTIONS) private actionsClientProxy: ClientProxy,
  ) {}

  // @Patch('test')
  // public test() {
  //   console.log('ngo minh duc');

  //   return 'ok';
  // }

  @Get('stats')
  public a() {}

  @Get('stats/revenue')
  @ApiCreateOperation({ summary: 'Thống kê doanh thu' })
  public b() {}

  @Get('stats/media')
  @ApiCreateOperation({ summary: 'Thống kê nội dung' })
  public c() {}

  @ApiCreateOperation({ summary: 'Thống kê theo thời gian sử dụng' })
  @Get('stats/on-screen')
  public d() {}

  @Get('noti')
  @Public()
  public async testNoti() {
    const data: IFirebaseSendNotificationGroupDevices = {
      notification: {
        title: 'string',
        body: 'string',
      },
      userId: 32,
      data: {
        message_content: 'thoong baos db',
        sender_name: 'minh duc',
      },
    };
    await this.actionsClientProxy
      .send<any>(ACTIONS_MESSAGE_PATTERN.NOTI.SEND_GROUP, data)
      .toPromise();
    return 'ok';
  }
}
