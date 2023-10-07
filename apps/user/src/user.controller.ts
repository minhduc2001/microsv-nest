import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import * as excRpc from '@libs/common/api';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_MESSAGE_PATTERNS.LOGIN)
  getHello() {
    try {
      throw new excRpc.BadException({ message: '' });
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }

    // return this.userService.getUserByUniqueKey({ email: 'haha' });
  }
}
