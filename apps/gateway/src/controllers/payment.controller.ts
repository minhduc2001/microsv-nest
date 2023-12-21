import { ApiCreateOperation, ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePaymentDto } from '@libs/common/dtos/payment-system.dto';
import { User } from '@libs/common/entities/user/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { firstValueFrom } from 'rxjs';
import { PAYMENT_SYSTEM_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import * as exc from '@libs/common/api';

@ApiTagsAndBearer('Payment')
@Controller('payment')
@Auth()
export class PaymentController {
  constructor(
    @Inject(RabbitServiceName.PAYMENT_SYSTEM)
    private readonly paymentSystemClientProxy: ClientProxy,
  ) {}

  @Post()
  @ApiCreateOperation({ summary: 'Khởi tạo thanh toán' })
  async createPayment(@Body() dto: CreatePaymentDto, @GetUser() user: User) {
    try {
      const resp = await firstValueFrom(
        this.paymentSystemClientProxy.send<any>(
          PAYMENT_SYSTEM_MESSAGE_PATTERN.PAYMENT.CREATE_PAYMENT,
          { ...dto, user: user },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  // @Public()
  @Post('return')
  @ApiCreateOperation({
    summary: 'you can not call this api. warning!!!!/ api return payment',
  })
  async return(@Body() body: any) {
    try {
      const resp = await firstValueFrom(
        this.paymentSystemClientProxy.send<any>(
          PAYMENT_SYSTEM_MESSAGE_PATTERN.PAYMENT.RESPONSE_THIRD_PARTY_PAYMENT,
          body,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }
}
