import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import * as excRpc from '@libs/common/api';
import {
  CheckOTPDto,
  LoginDto,
  RegisterDto,
  UserUpdateDto,
} from '@libs/common/dtos/user.dto';
import { ListDto } from '@libs/common/dtos/common.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_MESSAGE_PATTERNS.LOGIN)
  async login(@Payload() body: LoginDto) {
    try {
      return this.userService.loginUser(body);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.LOGIN_WITH_GOOGLE)
  async loginThirtParty(@Payload() data: any) {
    try {
      return this.userService.thirdPartyLogin(data);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.REGISTER)
  async register(@Payload() body: RegisterDto) {
    try {
      return this.userService.registerUser(body);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.GET_USER_LISTS)
  async getAllUser(@Payload() query: ListDto) {
    return this.userService.getAllUser(query);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.GET_USER_ACCOUNT)
  async getUserWithRelationship(@Payload() id: number) {
    return this.userService.getUserByIdWithRelationship(id);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.GET_USER)
  async getUser(@Payload('id') id: number) {
    return this.userService.findOne({ where: { id } });
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.UPDATE_USER)
  async updateUserById(
    @Payload('id') userId: number,
    @Payload('userUpdate') userUpdate: UserUpdateDto,
  ) {
    try {
      return this.userService.updateUserByUserId(userId, userUpdate);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.USER_ACTIVE_ACCOUNT)
  async activeAccount(@Payload() email: string) {
    try {
      return this.userService.activeAccount(email);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.CHECK_EMAIL_EXISTS)
  async checkEmailExists(@Payload('email') email: string) {
    try {
      return this.userService.sendOtp(email);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.CHECK_OTP)
  async checkOTP(@Payload() payload: CheckOTPDto) {
    try {
      return this.userService.checkOtp(payload.email, payload.otpCode);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.USER_RESET_PASSWORD)
  async resetPassword(
    @Payload('email') email: string,
    @Payload('password') password: string,
  ) {
    try {
      return this.userService.resetPassword(email, password);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }
}
