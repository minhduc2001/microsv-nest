import { ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as exc from '@libs/common/api';
import {
  LoginDto,
  RegisterDto,
  UserUpdateDto,
} from '@libs/common/dtos/user.dto';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import { Auth } from '../auth/decorators/auth.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Response } from 'express';
import { UserService } from '../services/user.service';
import { ParamIdDto } from '@libs/common/dtos/common.dto';

@ApiTagsAndBearer('User')
@Controller('user')
@Auth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(RabbitServiceName.USER) private userClientProxy: ClientProxy,
  ) {}

  @Post('login')
  @Public()
  async login(@Body() body: LoginDto) {
    try {
      const data = await firstValueFrom(
        this.userClientProxy.send<any>(USER_MESSAGE_PATTERNS.LOGIN, body),
      );

      const tokens = await this.userService.getTokens({
        sub: data.id,
        email: data.enail,
      });

      return {
        ...data,
        ...tokens,
      };
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }

  @Post('register')
  @Public()
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

  @Patch(':id')
  async updateUser(
    @Param() param: ParamIdDto,
    @Body() userUpdate: UserUpdateDto,
  ) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(USER_MESSAGE_PATTERNS.UPDATE_USER, {
          id: param.id,
          userUpdate,
        }),
      );
      return resp;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }
}
