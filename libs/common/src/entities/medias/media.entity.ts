import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { Author } from './author.entity';
import { Genre } from './genre.entity';
import {
  ETypeAuthor,
  ETypeGenre,
  ETypeMedia,
} from '@libs/common/enums/media.enum';
import { convertUrl } from '@libs/common/utils/url-reslove';
import { EState } from '@libs/common/enums/common.enum';
import { BadException } from '@libs/common/api';

@Entity()
export class Media extends AbstractEntity {
  @Column()
  title: string;

  @Column({ nullable: true, default: null })
  publishDate: Date;

  @Column({ nullable: true, default: 0 })
  views?: number;

  @Column({ nullable: true, default: 0 })
  likes?: number;

  @Column({ nullable: true, default: '' })
  desc: string;

  @Column()
  minAge: number;

  @Column({ default: '', nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  duration?: number;

  @Column({ default: 0 })
  golds: number;

  isAccess: boolean;

  @Column({ type: 'enum', enum: ETypeMedia, nullable: false })
  type: ETypeMedia;

  @Column({ type: 'enum', enum: EState, default: EState.InActive })
  state: EState;

  @ManyToMany(() => Author, (author) => author.medias)
  @JoinTable()
  authors: Author[];

  @ManyToMany(() => Genre, (genre) => genre.medias)
  @JoinTable()
  genres: Genre[];

  isLike: boolean;
  isPlaylist: boolean;

  @AfterLoad()
  afterload() {
    if (this.url) this.url = convertUrl(this.url, this.type);

    if (!this.isAccess && this.golds > 0) {
      this.isAccess = false;
    } else this.isAccess = true;

    if (!this.isLike) this.isLike = false;
    else this.isLike = true;

    if (!this.isPlaylist) this.isPlaylist = false;
    else this.isPlaylist = true;
  }
}
