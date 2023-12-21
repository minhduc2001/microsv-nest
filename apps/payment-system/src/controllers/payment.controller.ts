import { PAYMENT_SYSTEM_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import {
  CreatePackageDto,
  CreatePaymentDto,
  ListPackageDto,
  UpdatePackageDto,
  UpdateStatePackageDto,
} from '@libs/common/dtos/payment-system.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import * as excRpc from '@libs/common/api';
import { PackageService } from '../services/package.service';
import { User } from '@libs/common/entities/user/user.entity';
import { PaymentService } from '../services/payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern(PAYMENT_SYSTEM_MESSAGE_PATTERN.PAYMENT.CREATE_PAYMENT)
  async create(@Payload() payload: CreatePaymentDto) {
    try {
      return this.paymentService.createPayment(payload);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(
    PAYMENT_SYSTEM_MESSAGE_PATTERN.PAYMENT.RESPONSE_THIRD_PARTY_PAYMENT,
  )
  async verify(@Payload() payload: any) {
    console.log(payload);

    try {
      return this.paymentService.confirmPayment(payload);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }
}
