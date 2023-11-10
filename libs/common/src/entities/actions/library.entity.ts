import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';

@Entity()
export class Library extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  userId: number;
}
