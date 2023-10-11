import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';

@Entity()
export class Notification extends AbstractEntity {
  @Column()
  userId: number;

  @Column({ type: 'simple-array', default: [] })
  registerIds: string[];

  @Column({ nullable: true })
  notification_key: string;

  @Column({ nullable: true })
  notification_key_name: string;
}
