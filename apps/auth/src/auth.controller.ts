import { Controller, Get, UseFilters } from '@nestjs/common';

// Libs
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import { IServiceResponse } from '@libs/rabbit/interfaces/rabbit-massage.interface';
import * as excRpc from '@libs/common/api/exception.reslove';

// Apps
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_MESSAGE_PATTERNS.TEST)
  async getHello(@Payload() a: any) {
    try {
      console.log(a);
      if (a)
        throw new excRpc.BadException({
          message: 'anh yeu em',
          data: { a: 1089026 },
        });
      return { adksajhdkjshk: 'asgd' };
    } catch (error) {
      throw new excRpc.BadException({
        message: 'anh yeu em',
        data: error.response.data,
      });
    }
  }

  @MessagePattern(AUTH_MESSAGE_PATTERNS.TEST1)
  async getHello1() {
    console.log();
  }
}
