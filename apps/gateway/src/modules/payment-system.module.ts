import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Module } from '@nestjs/common';
import { PackageController } from '../controllers/package.controller';

@Module({
  imports: [RabbitModule.forClientProxy(RabbitServiceName.PAYMENT_SYSTEM)],
  controllers: [PackageController],
  providers: [],
})
export class PaymentSystemModule {}
