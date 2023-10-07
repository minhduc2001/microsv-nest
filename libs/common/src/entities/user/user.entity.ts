import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';

@Entity()
export class User extends AbstractEntity {
  @Column()
  username: string;
}
