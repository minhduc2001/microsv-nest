import { User } from '@libs/common/entities/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserGetByUniqueKey } from './user.interface';
import { BaseService } from '@libs/common/services/base.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) protected repository: Repository<User>) {
    super(repository);
  }

  async getAllUser(query: any) {
    return this.listWithPage(query);
  }

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
