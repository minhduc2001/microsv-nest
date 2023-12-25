import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserSeed } from './user.seed';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly userSeed: UserSeed) {}
  async onModuleInit() {
    await Promise.all([this.userSeed.seed()]);
    console.log('init ok');
  }
}
