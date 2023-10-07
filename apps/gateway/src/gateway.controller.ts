import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';

// libs
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { IServiceResponse } from '@libs/rabbit/interfaces/rabbit-massage.interface';
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import * as exc from '@libs/common/api';
import { ApiTagsAndBearer } from '@libs/common/swagger-ui';

// apps
import { Auth } from './auth/decorators/auth.decorator';
import { Public } from '@app/gateway/src/auth/decorators/public.decorator';

@ApiTagsAndBearer('Gateway')
@Controller()
export class GatewayController {
  constructor(
    @Inject(RabbitServiceName.USER) private userClientProxy: ClientProxy,
  ) {}
}
