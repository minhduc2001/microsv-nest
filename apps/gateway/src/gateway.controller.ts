import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ApiTags } from '@nestjs/swagger';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';
import { IServiceResponse } from '@libs/rabbit/interfaces/rabbit-massage.interface';
import { AUTH_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import * as exc from '@libs/common/api';
import { firstValueFrom, lastValueFrom } from 'rxjs';
@ApiTags('Gateway')
@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject(RabbitServiceName.AUTH) private authClientProxy: ClientProxy,
    @Inject(RabbitServiceName.USER) private userClientProxy: ClientProxy,
  ) {}

  @Post()
  async getHello(@Body() data: any) {
    try {
      const resp = await lastValueFrom(
        this.authClientProxy.send<any>(AUTH_MESSAGE_PATTERNS.TEST, { a: 100 }),
      );

      console.log(resp);

      return resp;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }
}
