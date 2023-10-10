import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import {
  EPaymentMethod,
  EPaymentStatus,
} from '@libs/common/enums/payment-system.enum';

@Entity()
export class Payment extends AbstractEntity {
  @Column()
  userId: number;

  @Column()
  username: string;

  @Column()
  packageId: number;

  @Column()
  packageName: string;

  @Column()
  price: string;

  @Column({
    type: 'enum',
    enum: EPaymentStatus,
    default: EPaymentStatus.PENDDING,
  })
  status: EPaymentStatus;

  @Column({ type: 'enum', enum: EPaymentMethod })
  paymentMethod: EPaymentMethod;
}
