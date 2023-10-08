import { User } from '@libs/common/entities/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserGetByUniqueKey } from './user.interface';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { LoginDto, RegisterDto } from '@libs/common/dtos/user.dto';
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

    const user: User = await this.userRepository.findOne({
      where: { email },
      relations: { profiles: true },
    });

    if (!user)
      throw new excRpc.NotFound({ message: 'Email does not existed!' });

    if (!user.comparePassword(password))
      throw new excRpc.BadRequest({ message: 'password incorrect' });

    if (!user.isActive)
      throw new excRpc.BadRequest({ message: 'Account is not activated' });

    return user;
  }

  async registerUser(newUser: RegisterDto) {
    const { email, password, phone, address, username } = newUser;
    const checkExisted = await this.userRepository.findOne({
      where: { email: newUser.email },
    });

    if (checkExisted)
      throw new excRpc.BadRequest({ message: 'Account has already exist!' });

    const saveUser = Object.assign(new User(), {
      username,
      email,
      phone,
      address,
    });
    saveUser.setPassword(password);

    this.userRepository.insert(saveUser);

    return 'Register Successful!';
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new excRpc.BadRequest({ message: 'Account does not existed!' });
    return user;
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
