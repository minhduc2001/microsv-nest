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
import { ApiTagsAndBearer } from '@libs/common/swagger-ui';

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

  @Patch('test')
  public test() {
    console.log('ngo minh duc');

    return 'ok';
  }

  @Get('noti')
  @Public()
  public async testNoti() {
    console.log('ngo minh duc');

    const data: IFirebaseSendNotificationGroupDevices = {
      notification: {
        title: 'string',
        body: 'string',
      },
      registrationTokens: [
        'dqxHIW9bSLG-FE4Byafyj0:APA91bHA3_uMAxOcQBAIyYZs1HB5iC3Pmm5Uk8hhOSExi6zfn_qN8nLb6fseSlVY1sAVcDmIclJnUQFDtk9sUJf4C50QrNSlBvGUDArcaT29tkdrA43sgbGycR7Wt0ozJH4t9hwO1dT6',
      ],
      notification_key:
        'APA91bHO_vLyXS76Rp-EdYBGoMDzZANdTCx8UWYF7phh9XIKMGSLuKJ6yncNANa2dVo1kSnsCwe6cjiRxV3gcPITPmL7RANSXvUXa6spcW2YPT_X4j3di_Alm5Y2tNYH1_fQenQME7wN',
      notification_key_name: '0b9a-82e8-41f7_2',
    };
    await this.actionsClientProxy
      .send<any>(ACTIONS_MESSAGE_PATTERN.NOTI.SEND_GROUP, data)
      .toPromise();
    return 'ok';
  }
}
