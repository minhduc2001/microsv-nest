import { Module } from '@nestjs/common';
import { PaymentSystemController } from './payment-system.controller';
import { PaymentSystemService } from './payment-system.service';
import { LoggerModule } from '@libs/logger';
import { DatabaseModule } from '@libs/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from '@libs/common/entities/payment-system/package.entity';
import { Payment } from '@libs/common/entities/payment-system/payment.entity';
import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { PackageController } from './controllers/package.controller';
import { PackageService } from './services/package.service';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';

@Module({
  imports: [
    RabbitModule.forServerProxy(RabbitServiceName.PAYMENT_SYSTEM),
    RabbitModule.forClientProxy(RabbitServiceName.USER),
    LoggerModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Package, Payment]),
  ],
  controllers: [PaymentSystemController, PackageController, PaymentController],
  providers: [PaymentSystemService, PackageService, PaymentService],
})
export class PaymentSystemModule {}
