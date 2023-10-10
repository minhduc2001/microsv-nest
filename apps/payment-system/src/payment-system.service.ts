import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentSystemService {
  getHello(): string {
    return 'Hello World!';
  }
}
