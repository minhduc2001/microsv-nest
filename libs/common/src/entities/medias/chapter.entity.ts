import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { Comics } from './comics.entity';
import { EState } from '@libs/common/enums/common.enum';
import { ComicsImageurl } from '@libs/common/interfaces/common.interface';

@Entity()
export class Chapter extends AbstractEntity {
  @Column({ nullable: true })
  name: string;

  @Column()
  chap: number;

  @Column('jsonb', { nullable: true })
  imageUrl: ComicsImageurl[];

  @Column({ default: 0 })
  views: number;

  @ManyToOne(() => Comics, (comics) => comics.chapters)
  comics: Comics;

  @Column({ type: 'enum', enum: EState, default: EState.InActive })
  state: EState;
}
