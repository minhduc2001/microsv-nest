import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { Library } from './library.entity';

@Entity()
export class LibraryChild extends AbstractEntity {
  @Column({ nullable: true })
  musicId: number;

  @Column({ nullable: true })
  movieId: number;

  @Column({ nullable: true })
  comicsId: number;

  @ManyToOne(() => Library, (lib) => lib.libraryChilds)
  library: Library;
}
