import { Column, Entity, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { ComicsImageurl } from '@libs/common/interfaces/common.interface';
import { ETypeGenre } from '@libs/common/enums/media.enum';
import { Comics } from './comics.entity';
import { Media } from './media.entity';

@Entity()
export class Genre extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: ETypeGenre })
  type: ETypeGenre;

  @ManyToMany(() => Comics, (comics) => comics.genres)
  comics: Comics[];

  @ManyToMany(() => Media, (media) => media.genres)
  medias: Media[];
}
