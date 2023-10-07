import { User } from '@libs/common/entities/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserGetByUniqueKey } from './user.interface';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { LoginDto } from '@libs/common/dtos/user.dto';
import * as excRpc from '@libs/common/api';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) protected userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async getAllUser(query: any) {
    const config: PaginateConfig<User> = {
      sortableColumns: ['id'],
    };
    return this.listWithPage(query, config);
  }

  async loginUser(dto: LoginDto) {
    const { email, password } = dto;

    const user: User = await this.userRepository.findOne({ where: { email } });

    if (!user)
      throw new excRpc.NotFound({ message: 'Email does not existed!' });

    if (user.comparePassword(password))
      throw new excRpc.BadRequest({ message: 'password incorrect' });

    if (!user.isActive)
      throw new excRpc.BadRequest({ message: 'Account is not activated' });

    return {
      user,
      accessToken: 'abcabac',
      refreshToken: 'abcabc',
    };
  }

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
