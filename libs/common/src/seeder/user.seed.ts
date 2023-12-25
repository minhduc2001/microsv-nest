import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user/user.entity';
import { Repository } from 'typeorm';
import { ERole } from '../enums/role.enum';

@Injectable()
export class UserSeed {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async seed() {
    const count = await this.repository.count();

    if (count > 0) return;

    const users = [
      {
        id: 1,
        username: 'Ngô Minh Đức - B19DCPT056',
        email: 'admin@admin.com',
        password: '123123',
        role: ERole.ADMIN,
        isActive: true,
      },
    ];
    console.log('watting!');

    const temp = this.repository.create(users[0]);
    temp.setPassword(temp.password);
    await temp.save();
    console.log('init user done!');
  }
}
