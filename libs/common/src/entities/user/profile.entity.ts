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

  @Column({ default: 0 })
  golds: number;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: ERole, default: ERole.CHILDRENS })
  role: ERole;

  @Column({ default: 0 })
  progress: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  isLocked: boolean;

  @ManyToOne(() => User, (user) => user.profiles)
  user: User;
}
