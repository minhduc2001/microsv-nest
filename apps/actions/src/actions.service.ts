import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionsService {
  getHello(): string {
    return 'Hello World!';
  }
}
