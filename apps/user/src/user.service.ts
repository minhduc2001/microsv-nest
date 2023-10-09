import { User } from '@libs/common/entities/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICreateUser, IUserGetByUniqueKey } from './user.interface';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import {
  LoginDto,
  RegisterDto,
  UserUpdateDto,
} from '@libs/common/dtos/user.dto';
import * as excRpc from '@libs/common/api';
import { MailerService } from '@libs/mailer';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) protected userRepository: Repository<User>,
    private mailerService: MailerService,
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
      select: { profiles: { id: true, nickname: true, avatar: true } },
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

    // send mail
    await this.mailerService.sendMail({
      to: saveUser.email,
      subject: 'Xác thực tài khoản Zappy.',
      body: {
        title: 'Xác thực tài khoản Zappy.',
        content:
          'Để có thể sử dụng hệ thống Zappy, bạn cần phải xác thực tài khoản. Vui lòng nhấn vào nút bên dưới để xác thực tài khoản.',
        username,
        url: `http:localhost:8081/api/v1/user/active?email=${saveUser.email}`,
      },
      template: 'email-signup',
    });

    return 'Register Successful!';
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new excRpc.BadRequest({ message: 'Account does not existed!' });
    return user;
  }

  async updateUserByUserId(userId: number, userUpdate: UserUpdateDto) {
    const user = await this.getUserById(userId);
    const newInfo = Object.assign(new User(), { ...userUpdate });
    await this.userRepository.update(user.id, { ...newInfo });

    return 'Update user info succesful';
  }

  async activeAccount(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new excRpc.BadRequest({ message: 'Account does not existed!' });

    await this.userRepository.update(user.id, { isActive: true });

    return 'Active successful';
  }

  async resetPassword(userId: number, password: string) {
    const user = await this.getUserById(userId);
    const newPass = Object.assign(new User(), { password });
    newPass.setPassword(password);
    await this.userRepository.update(user.id, { password: newPass.password });

    return 'Reset Password Successful';
  }

  async createUser(data: ICreateUser) {
    try {
      const user: User = this.repository.create(data);
      if (user.password) user.setPassword(data.password);
      await user.save();

      return user;
    } catch (e) {
      throw new excRpc.BadRequest({ message: e.message });
    }
  }

  async thirdPartyLogin(data: any) {
    if (data.provider == 'google') {
      let user = await this.findOne({ where: { email: data.email } });

      if (!user) {
        user = await this.createUser({ ...data, isActive: true });
      }
      return user;
    }
    if (data.provider == 'facebook') {
    }
  }
}
