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

@ApiTagsAndBearer('Gateway')
@Controller()
@Auth()
export class GatewayController {
  constructor(
    @Inject(RabbitServiceName.USER) private userClientProxy: ClientProxy,
  ) {}

  @Patch('test')
  public test() {
    console.log('ngo minh duc');

    return 'ok';
  }
}
