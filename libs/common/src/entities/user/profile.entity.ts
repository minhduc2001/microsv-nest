import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { ERole } from '@libs/common/enums/role.enum';
import { User } from '@libs/common/entities/user/user.entity';

@Entity()
export class Profile extends AbstractEntity {
  @Column({ nullable: false })
  nickname: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column()
  golds: number;

  @Column()
  avatar: string;

  @Column({ type: 'enum', enum: ERole, default: ERole.CHILDRENS })
  role: ERole;

  @ManyToOne(() => User, (user) => user.profiles)
  user: User;
}
