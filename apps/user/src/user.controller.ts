import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import * as excRpc from '@libs/common/api';
import { LoginDto } from '@libs/common/dtos/user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_MESSAGE_PATTERNS.LOGIN)
  async login(@Payload() body: LoginDto) {
    try {
      console.log(body);
      throw new excRpc.BadException({ message: 'loi roi' });
      return body;
    } catch (e) {
      throw new excRpc.BusinessException({ message: e.message });
    }

    // return this.userService.getUserByUniqueKey({ email: 'haha' });
  }
}
