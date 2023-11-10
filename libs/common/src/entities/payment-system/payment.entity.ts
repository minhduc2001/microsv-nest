import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import {
  EPaymentMethod,
  EPaymentStatus,
} from '@libs/common/enums/payment-system.enum';
import { Package } from './package.entity';

@Entity()
export class Payment extends AbstractEntity {
  @Column()
  userId: number;

  @Column()
  username: string;

  @Column()
  packageName: string;

  @Column()
  golds: number;

  @Column()
  image: string;

  @Column()
  price: string;

  @Column()
  discount: number;

  @Column({ nullable: true })
  requestId: string;

  @Column({ nullable: true })
  orderId: string;

  @Column({
    type: 'enum',
    enum: EPaymentStatus,
    default: EPaymentStatus.PENDDING,
  })
  status: EPaymentStatus;

  @Column({ type: 'enum', enum: EPaymentMethod })
  paymentMethod: EPaymentMethod;

  @ManyToOne(() => Package, (pack) => pack.payments)
  @JoinColumn()
  package: Package;
}
