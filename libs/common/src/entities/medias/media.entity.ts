import {
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
import { ETypeGenreMedia } from '@libs/common/enums/media.enum';

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

  @Column({ default: '', nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  duration?: number;

  @Column({ nullable: true, type: 'boolean', default: true })
  isAccess: boolean;

  @Column({ type: 'enum', enum: ETypeGenreMedia })
  type: ETypeGenreMedia;

  @ManyToOne(() => Author, (author) => author.media)
  @JoinColumn()
  author: Author[];

  @ManyToMany(() => Genre, (genre) => genre.media)
  @JoinTable()
  genre: Genre[];
}
