import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  getHello(): string {
    console.log('vao day');

    return 'Hello World!';
  }
}
