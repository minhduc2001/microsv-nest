import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { Media } from './media.entity';
import { Comics } from './comics.entity';
import { ETypeGenreMedia } from '@libs/common/enums/media.enum';

@Entity()
export class Author extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'enum', enum: ETypeGenreMedia })
  type: ETypeGenreMedia;

  @OneToMany(() => Media, (media) => media.author)
  media: Media[];

  @OneToMany(() => Comics, (comics) => comics.author)
  comics: Comics[];
}
