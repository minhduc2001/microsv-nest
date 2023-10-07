import { User } from '@libs/common/entities/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserGetByUniqueKey } from './user.interface';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) protected repository: Repository<User>) {
    super(repository);
  }

  async getAllUser(query: any) {
    const config: PaginateConfig<User> = {
      sortableColumns: ['id'],
    };
    return this.listWithPage(query, config);
  }

  async login() {}

  private _getUserByUniqueKey(option: IUserGetByUniqueKey): Promise<User> {
    const findOption: Record<string, any>[] = Object.entries(option).map(
      ([key, value]) => ({ [key]: value }),
    );
    return this.repository
      .createQueryBuilder('user')
      .where(findOption)
      .getOne();
  }
}
