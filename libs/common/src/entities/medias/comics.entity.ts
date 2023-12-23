import {
  AfterLoad,
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

  @Column({ nullable: true })
  desc: string;

  @Column()
  thumbnail: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  golds: number;

  isAccess: boolean;

  @Column({ type: 'enum', enum: EState, default: EState.InActive })
  state: EState;

  @ManyToMany(() => Genre, (genre) => genre.comics)
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => Chapter, (chapter) => chapter.comics)
  @JoinColumn()
  chapters: Chapter[];

  @ManyToMany(() => Author, (author) => author.comics)
  @JoinTable()
  authors: Author[];

  isLike: boolean;
  isPlaylist: boolean;

  @AfterLoad()
  afterload() {
    if (!this.isAccess && this.golds > 0) {
      this.isAccess = false;
      delete this.chapters;
    } else this.isAccess = true;

    if (!this.isLike) this.isLike = false;
    else this.isLike = true;

    if (!this.isPlaylist) this.isPlaylist = false;
    else this.isPlaylist = true;
  }
}
