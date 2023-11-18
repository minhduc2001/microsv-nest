import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { Exclude } from 'class-transformer';
import { ERole } from '@libs/common/enums/role.enum';
import { Profile } from '@libs/common/entities/user/profile.entity';
import * as bycrypt from 'bcrypt';
import { EProviderLogin } from '@libs/common/enums/user.enum';

@Entity()
export class User extends AbstractEntity {
  @Column({ nullable: false })
  username: string;

  @Column({ unique: false, nullable: false })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isActive: boolean;

  @Column({ default: 0 })
  golds: number;

  @Column({ type: 'enum', enum: ERole, default: ERole.PARENTS })
  role: ERole;

  @OneToMany(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profiles: Profile[];

  @Column({
    type: 'enum',
    enum: EProviderLogin,
    default: EProviderLogin.Normal,
  })
  provider: EProviderLogin;

  setPassword(password: string) {
    this.password = bycrypt.hashSync(password, 10);
  }

  comparePassword(rawPassword: string): boolean {
    const userPassword = this.password;
    return bycrypt.compareSync(rawPassword, userPassword);
  }
}
