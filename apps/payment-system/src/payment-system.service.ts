import { Package } from '@libs/common/entities/payment-system/package.entity';
import { Payment } from '@libs/common/entities/payment-system/payment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentSystemService {
  constructor(
    @InjectRepository(Payment)
    protected readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Package)
    protected readonly packageRepository: Repository<Package>,
  ) {}

  async totalPackage() {
    return this.packageRepository.count();
  }
}
