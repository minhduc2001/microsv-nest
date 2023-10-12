import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { ComicsImageurl } from '@libs/common/interfaces/common.interface';
import { Comics } from './comics.entity';

@Entity()
export class Chapter extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  chap: number;

  @Column('jsonb', { nullable: true })
  imageUrl: ComicsImageurl[];

  @Column()
  views: number;

  @ManyToOne(() => Comics, (comics) => comics.chapters)
  comics: Comics;
}
