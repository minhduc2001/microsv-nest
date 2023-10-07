import {
  CreateProfileDto,
  UpdateProfileDto,
} from '@libs/common/dtos/profile.dto';
import { Profile } from '@libs/common/entities/user/profile.entity';
import { BaseService } from '@libs/common/services/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as excRpc from '@libs/common/api';
import { UserService } from '../user.service';

export class ProfileService extends BaseService<Profile> {
  constructor(
    @InjectRepository(Profile) protected profileRepository: Repository<Profile>,
    private userService: UserService,
  ) {
    super(profileRepository);
  }

  async getAllProfileByUserId(userId: number) {}

  async createProfile(payload: CreateProfileDto) {
    const { nickname, birthday, avatar, userId } = payload;

    this.userService.getUserById(userId); // validate check user existed

    const checkExisted = await this.profileRepository.findOne({
      where: { nickname, user: { id: userId } },
    });

    if (checkExisted)
      throw new excRpc.BadRequest({ message: 'Profile had been exist' });

    const newProfile = Object.assign(new Profile(), {
      nickname,
      birthday,
      avatar,
    });
    newProfile.user.id = userId;

    this.profileRepository.insert(newProfile);

    return 'Create Profile Successful';
  }

  async updateProfile(profileId: number, payload: UpdateProfileDto) {
    this.getProfileById(profileId);

    this.profileRepository.update(profileId, { ...payload });

    return 'Update profile successful';
  }

  async getProfileById(id: number) {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile)
      throw new excRpc.BadRequest({ message: 'Profile does not exist!' });
    return profile;
  }
}
