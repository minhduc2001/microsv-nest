import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { EState } from '@libs/common/enums/common.enum';

@Entity()
export class Comment extends AbstractEntity {
  @Column()
  content: string;

  @Column()
  stars: string;

  @Column()
  userId: number;

  @Column({ type: 'enum', enum: EState, default: EState.Active })
  state: EState;
}
