import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { Media } from './media.entity';
import { Comics } from './comics.entity';

@Entity()
export class Author extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Media, (media) => media.author)
  media: Media[];

  @OneToMany(() => Comics, (comics) => comics.author)
  comics: Comics[];
}
