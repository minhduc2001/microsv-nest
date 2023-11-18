import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { ETypeHistory } from '@libs/common/enums/actions.enum';
import * as excRpc from '@libs/common/api';

@Entity()
export class History extends AbstractEntity {
  @Column()
  userId: number;

  @Column({ nullable: true })
  mediaId: number;

  @Column({ nullable: true })
  comicsId: number;

  @Column({ nullable: true })
  chapterId: number;

  @Column({ nullable: true })
  indexChapter: number;

  @Column({ nullable: true, default: 0 })
  duration: number;

  @Column({ nullable: true, default: 0 })
  position: number;

  @Column({ enum: ETypeHistory })
  type: ETypeHistory;

  @BeforeInsert()
  beforeCreate() {
    if (
      (this.type === ETypeHistory.Music || this.type === ETypeHistory.Movie) &&
      !this.mediaId
    ) {
      throw new excRpc.BadException({ message: 'Sai dữ liệu!' });
    }

    if (
      this.type === ETypeHistory.Comics &&
      (!this.chapterId || !this.comicsId)
    ) {
      throw new excRpc.BadException({ message: 'Sai dữ liệu!' });
    }
  }
}