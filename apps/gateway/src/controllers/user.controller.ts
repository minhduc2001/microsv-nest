import { ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as exc from '@libs/common/api';
import { LoginDto, RegisterDto } from '@libs/common/dtos/user.dto';
import { firstValueFrom } from 'rxjs';
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import { Auth } from '../auth/decorators/auth.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTagsAndBearer('User')
@Controller('user')
@Auth()
export class UserController {
  constructor(
    @Inject(RabbitServiceName.USER) private userClientProxy: ClientProxy,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(USER_MESSAGE_PATTERNS.LOGIN, body),
      );
      return resp;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(USER_MESSAGE_PATTERNS.REGISTER, body),
      );
      return resp;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }
}
