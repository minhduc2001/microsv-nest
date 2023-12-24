import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { EState } from '@libs/common/enums/common.enum';

@Entity()
export class Noti extends AbstractEntity {
  @Column()
  content: string;

  @Column()
  userId: number;

  @Column({ default: false })
  isViews: boolean;
}
