import { DatabaseModule } from '@libs/database';
import { SeederService } from './seeder.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user/user.entity';
import { UserSeed } from './user.seed';
import { Profile } from '../entities/user/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  providers: [SeederService, UserSeed],
})
export class SeederModule {}
