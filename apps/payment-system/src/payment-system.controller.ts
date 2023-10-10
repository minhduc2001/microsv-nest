import { Controller, Get } from '@nestjs/common';
import { PaymentSystemService } from './payment-system.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PAYMENT_SYSTEM_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { ListPackageDto } from '@libs/common/dtos/payment-system.dto';
import * as excRpc from '@libs/common/api';

// thong ke
@Controller()
export class PaymentSystemController {
  constructor(private readonly paymentSystemService: PaymentSystemService) {}
}
