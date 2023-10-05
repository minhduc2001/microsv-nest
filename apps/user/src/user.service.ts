import { User } from '@app/common/entities/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) protected repository: Repository<User>) {}

  async getHello() {
    this.repository.findOne({ where: {} });
    return '';
  }
}
