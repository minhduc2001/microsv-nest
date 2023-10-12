import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { EState } from '@libs/common/enums/common.enum';
import { Genre } from './genre.entity';
import { Chapter } from './chapter.entity';
import { Author } from './author.entity';

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

  @Column()
  isAccess: boolean;

  @Column({ type: 'enum', enum: EState, default: EState.InActive })
  state: EState;

  @ManyToMany(() => Genre, (genre) => genre.comics)
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => Chapter, (chapter) => chapter.comics)
  @JoinColumn()
  chapters: Chapter[];

  @ManyToOne(() => Author, (author) => author.comics)
  @JoinColumn()
  author?: Author[];
}
