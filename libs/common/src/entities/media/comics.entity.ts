import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { EState } from '@libs/common/enums/common.enum';
import { Genre } from './genre.entity';
import { Chapter } from './chapter.entity';

@Entity()
export class Comics extends AbstractEntity {
  @Column()
  title: string;

  @Column({ default: 2 })
  minAge: number;

  @Column()
  desc: string;

  @Column()
  thumbnail: string;

  @Column()
  views: number;

  @Column({ type: 'enum', enum: EState, default: EState.InActive })
  state: EState;

  @ManyToMany(() => Genre, (genre) => genre.comics)
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => Chapter, (chapter) => chapter.comics)
  @JoinColumn()
  chapters: Chapter[];
}
