import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ApiTags } from '@nestjs/swagger';
import { RabbitServiceName } from '@app/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';
import { IServiceResponse } from '@app/rabbit/interfaces/rabbit-massage.interface';
import { AUTH_MESSAGE_PATTERNS } from '@app/common/constants/rabbit-patterns.constant';
import * as exc from '@app/common/api';
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
      const resp = await this.authClientProxy
        .send<any>(AUTH_MESSAGE_PATTERNS.TEST, { a: 100 })
        .toPromise();
      console.log(resp);

      // return JSON.stringify(resp);
      return resp;
    } catch (e) {
      throw new exc.BadRequest({ message: JSON.stringify(e) });
    }
  }
}
