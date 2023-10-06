import { User } from '@libs/common/entities/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserGetByUniqueKey } from './user.interface';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) protected repository: Repository<User>) {}

  async getUserByUniqueKey(option: IUserGetByUniqueKey): Promise<User> {
    const findOption: Record<string, any>[] = Object.entries(option).map(
      ([key, value]) => ({ [key]: value }),
    );
    return this.repository
      .createQueryBuilder('user')
      .where(findOption)
      .getOne();
  }
}
