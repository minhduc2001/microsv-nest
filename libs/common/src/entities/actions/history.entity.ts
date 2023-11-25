import {
  AfterLoad,
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

@Entity()
export class History extends AbstractEntity {
  @Column()
  userId: number;

  @Column({ nullable: true })
  musicId: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  chap: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  movieId: number;

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

  @AfterLoad()
  afterload() {
    if (this.comicsId) {
      delete this.movieId;
      delete this.musicId;
    } else {
      delete this.movieId;
    }
  }
}
