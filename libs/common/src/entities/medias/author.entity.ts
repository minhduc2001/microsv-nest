import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { Media } from './media.entity';
import { Comics } from './comics.entity';
import { ETypeAuthor } from '@libs/common/enums/media.enum';

@Entity()
export class Author extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'enum', enum: ETypeAuthor })
  type: ETypeAuthor;

  @ManyToMany(() => Media, (media) => media.authors)
  medias: Media[];

  @ManyToMany(() => Comics, (comics) => comics.authors)
  comics: Comics[];
}
