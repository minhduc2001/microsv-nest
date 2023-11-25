import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { LibraryChild } from './library-child.entity';

@Entity()
export class Library extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  userId: number; // profile

  @OneToMany(() => LibraryChild, (child) => child)
  @JoinColumn()
  libraryChilds: LibraryChild[];
}
