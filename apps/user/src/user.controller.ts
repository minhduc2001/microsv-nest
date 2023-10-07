import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import * as excRpc from '@libs/common/api';
import { LoginDto, RegisterDto } from '@libs/common/dtos/user.dto';

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

  @MessagePattern(USER_MESSAGE_PATTERNS.REGISTER)
  async register(@Payload() body: RegisterDto) {
    try {
      return this.userService.registerUser(body);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.GET_USER)
  async getUser(@Payload('id') id: number) {
    return this.userService.findOne({ where: { id } });
  }
}
