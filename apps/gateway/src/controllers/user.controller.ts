import { ApiCreateOperation, ApiTagsAndBearer } from '@libs/common/swagger-ui';
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
  CheckOTPDto,
  ForgotPasswordDto,
  IAddUserByAdmin,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  UserUpdateDto,
} from '@libs/common/dtos/user.dto';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import { Auth } from '../auth/decorators/auth.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ListDto, ParamIdDto } from '@libs/common/dtos/common.dto';
import { AuthGuard } from '@nestjs/passport';
import { CacheService } from '@libs/cache';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@libs/common/entities/user/user.entity';
import { MailerService } from '@libs/mailer';

@ApiTagsAndBearer('User')
@Controller('user')
@Auth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(RabbitServiceName.USER) private userClientProxy: ClientProxy,
    private readonly cacheService: CacheService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @ApiCreateOperation({ summary: 'Đăng nhập vào hệ thống' })
  async login(@Body() body: LoginDto) {
    try {
      const data = await firstValueFrom(
        this.userClientProxy.send<any>(USER_MESSAGE_PATTERNS.LOGIN, body),
      );

      const tokens = await this.userService.getTokens({
        sub: data.id,
        email: data.email,
      });

      return {
        ...data,
        ...tokens,
      };
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Get()
  @ApiCreateOperation({ summary: 'Lấy danh sách user' })
  async getAllUsers(@Query() query: ListDto) {
    try {
      const data = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.GET_USER_LISTS,
          query,
        ),
      );

      return data;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Get('me')
  @ApiCreateOperation({ summary: 'Lấy thông tin của bản thân' })
  async getMe(@GetUser() user: User) {
    try {
      console.log(user);

      return user;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Get('google')
  @Public()
  @UseGuards(AuthGuard('google'))
  @ApiCreateOperation({ summary: 'Đăng nhập bằng google' })
  async googleAuth(@Req() req: Request) {}

  @Get('google/redirect')
  @Public()
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

  @Get(':id')
  @ApiCreateOperation({ summary: 'Lấy chi tiết 1 user' })
  async getUserWithRelationship(@Param() params: ParamIdDto) {
    try {
      const data = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.GET_USER_ACCOUNT,
          params.id,
        ),
      );

      return data;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Post('register')
  @ApiCreateOperation({ summary: 'Đăng ký' })
  @Public()
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(USER_MESSAGE_PATTERNS.REGISTER, body),
      );

      const tokens = await this.userService.getTokens(
        {
          sub: resp.id,
          email: resp.email,
        },
        { expiresIn: '10m' },
      );

      await this.mailerService.sendMail({
        to: resp.email,
        subject: 'Xác thực tài khoản Zappy.',
        body: {
          title: 'Xác thực tài khoản Zappy.',
          content:
            'Để có thể sử dụng hệ thống Zappy, bạn cần phải xác thực tài khoản. Vui lòng nhấn vào nút bên dưới để xác thực tài khoản.',
          username: resp.username,
          url: `https://www.facebook.com/than.long.7330763/active?email=${resp.email}&accessToken=${tokens.accessToken}`,
        },
        template: 'email-signup',
      });

      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Post('create')
  @ApiCreateOperation({ summary: 'Tạo tài khoản bằng admin' })
  @Public()
  async createUserByAdmin(@Body() body: IAddUserByAdmin) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.CREATE_USER_BY_ADMIN,
          body,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Patch('active')
  @Public()
  @ApiCreateOperation({ summary: 'Kích hoạt tài khoản' })
  async activeAccount(
    @Query('email') email: string,
    @Query('accessToken') accessToken: string,
  ) {
    try {
      if (
        !accessToken ||
        !(await this.userService.verifyToken(accessToken, email))
      ) {
        throw new exc.BadException({ message: 'Đừng lừa tao!' });
      }
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.USER_ACTIVE_ACCOUNT,
          email,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Patch(':id')
  @ApiCreateOperation({ summary: 'Cập nhật thông tin' })
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
      throw new exc.CustomError(e);
    }
  }

  @Public()
  @Post('forgot-password')
  @ApiCreateOperation({ summary: 'Quên mật khẩu' })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.CHECK_EMAIL_EXISTS,
          body,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Public()
  @Post('check-otp')
  async checkOTP(@Body() payload: CheckOTPDto) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.CHECK_OTP,
          payload,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Public()
  @Post('reset-password')
  @ApiCreateOperation({ summary: '' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    try {
      const otp = await this.cacheService.get(body.email);
      if (!otp) throw new exc.BadException({ message: 'OTP does not exists!' });

      // @ts-ignore
      if (!otp.check)
        throw new exc.BadException({ message: 'OTP has not been verified!' });

      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.USER_RESET_PASSWORD,
          { email: body.email, password: body.password },
        ),
      );
      if (resp) await this.cacheService.del(body.email);
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }
}
