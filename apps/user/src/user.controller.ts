import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_MESSAGE_PATTERNS.LOGIN)
  getHello() {
    return this.userService.getUserByUniqueKey({ email: 'haha' });
  }
}
