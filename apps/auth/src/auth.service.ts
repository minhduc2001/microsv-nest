import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getHello(): string {
    console.log('vao day');

    return 'Hello World!';
  }
}
