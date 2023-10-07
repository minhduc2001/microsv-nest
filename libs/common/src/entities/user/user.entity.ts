import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { Exclude } from 'class-transformer';
import { ERole } from '@libs/common/enums/role.enum';
import { Profile } from '@libs/common/entities/user/profile.entity';
import * as bycrypt from 'bcrypt';

@Entity()
export class User extends AbstractEntity {
  @Column({ nullable: false })
  username: string;

  @Column({ unique: false, nullable: false })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  address: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isActive: boolean;

  @Column({ type: 'enum', enum: ERole, default: ERole.PARENTS })
  role: ERole;

  @ManyToOne(() => Profile, (profile) => profile.user)
  profiles: Profile[];

  setPassword(password: string) {
    this.password = bycrypt.hashSync(password, 10);
  }

  comparePassword(rawPassword: string): boolean {
    const userPassword = this.password;
    return bycrypt.compareSync(rawPassword, userPassword);
  }
}
