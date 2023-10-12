import { Injectable } from '@nestjs/common';

@Injectable()
export class MediasService {
  getHello(): string {
    return 'Hello World!';
  }
}
