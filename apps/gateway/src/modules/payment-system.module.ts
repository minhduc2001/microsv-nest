import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Module } from '@nestjs/common';
import { PackageController } from '../controllers/package.controller';
import { PaymentController } from '../controllers/payment.controller';

@Module({
  imports: [RabbitModule.forClientProxy(RabbitServiceName.PAYMENT_SYSTEM)],
  controllers: [PackageController, PaymentController],
  providers: [],
})
export class PaymentSystemModule {}
