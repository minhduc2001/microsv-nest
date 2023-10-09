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
  Req,
  Query,
  Res,
  UseGuards,
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
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ParamIdDto } from '@libs/common/dtos/common.dto';
import { AuthGuard } from '@nestjs/passport';
import { CacheService } from '@libs/cache';

interface CacheOtp {
  otp: string;
  check: boolean;
}

@ApiTagsAndBearer('User')
@Controller('user')
@Auth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(RabbitServiceName.USER) private userClientProxy: ClientProxy,
    private readonly cacheService: CacheService,
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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const data = await firstValueFrom(
      this.userClientProxy.send<any>(
        USER_MESSAGE_PATTERNS.LOGIN_WITH_GOOGLE,
        req.user,
      ),
    );

    const tokens = this.userService.getTokens({
      sub: data.id,
      email: data.email,
    });

    return {
      ...data,
      ...tokens,
    };
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

  @Patch('active')
  @Public()
  async activeAccount(@Query('email') email: string) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.USER_ACTIVE_ACCOUNT,
          email,
        ),
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

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    try {
      const data = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.CHECK_EMAIL_EXISTS,
          {
            email,
          },
        ),
      );

      if (data) {
        const cacheOtp: CacheOtp = {
          otp: Math.floor(Math.random() * 899999 + 100000).toString(),
          check: false,
        };

        await this.cacheService.setWithExpiration(email, cacheOtp, 10 * 60);
      }
      return true;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() body: any) {
    try {
      const otp = await this.cacheService.get(body.email);
      if (!otp) throw new exc.BadException({ message: '' });

      // @ts-ignore
      if (!otp.check) throw new exc.BadException({ message: '' });

      const data = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.USER_RESET_PASSWORD,
          { email: body.email, password: body.password },
        ),
      );

      if (data) {
        await this.cacheService.del(body.email);
      }
      return data;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }
}
