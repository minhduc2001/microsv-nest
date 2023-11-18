import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { EState } from '@libs/common/enums/common.enum';
import { Payment } from './payment.entity';

@Entity()
export class Package extends AbstractEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, default: 0 })
  price: number;

  @Column({ default: 0 })
  golds: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ type: 'enum', enum: EState, default: EState.InActive })
  state: EState;

  @Column({ nullable: true })
  image: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  desc: string;

  @OneToMany(() => Payment, (payment) => payment.package)
  payments: Payment[];
}
