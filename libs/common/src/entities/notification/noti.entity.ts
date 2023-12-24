import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { EState } from '@libs/common/enums/common.enum';

@Entity()
export class Noti extends AbstractEntity {
  @Column()
  messageContent: string;

  @Column()
  userId: number;

  @Column()
  messageId: string;

  @Column({ default: false })
  isView: boolean;
}
