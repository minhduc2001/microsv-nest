import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';

// libs
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { IServiceResponse } from '@libs/rabbit/interfaces/rabbit-massage.interface';
import { AUTH_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import * as exc from '@libs/common/api';
import { ApiTagsAndBearer } from '@libs/common/swagger-ui';

// apps
import { Auth } from './auth/decorators/auth.decorator';

@ApiTagsAndBearer('Gateway')
@Controller()
export class GatewayController {
  constructor(
    @Inject(RabbitServiceName.USER) private userClientProxy: ClientProxy,
  ) {}

  @Auth()
  @Post()
  async getHello(@Body() data: any) {
    try {
      const resp = await lastValueFrom(
        this.userClientProxy.send<any>(AUTH_MESSAGE_PATTERNS.TEST, { a: 100 }),
      );

      console.log(resp);

      return resp;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }
}
