import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { EState } from '@libs/common/enums/common.enum';

@Entity()
export class Package extends AbstractEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  price: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ type: 'enum', enum: EState, default: EState.Active })
  state: EState;

  @Column()
  desc: string;
}
