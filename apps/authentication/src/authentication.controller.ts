import { Controller, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { MessagePattern } from '@nestjs/microservices';
import { AUTH_MESSAGE_PATTERNS } from '@app/common/constants/rabbit-patterns.constant';
import { IServiceResponse } from '@app/rabbit/interfaces/rabbit-massage.interface';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern(AUTH_MESSAGE_PATTERNS.TEST)
  async getHello() {
    console.log('askdashjdksj');

    // return { adksajhdkjshk: 'asgd' };
  }

  @MessagePattern(AUTH_MESSAGE_PATTERNS.TEST1)
  async getHello1() {
    console.log();
  }
}
