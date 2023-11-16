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

  async getAllProfileByUserId(userId: number) {
    const user = await this.userService.getUserById(userId);
    return this.profileRepository.find({ where: { user: { id: user.id } } });
  }

  async createProfile(payload: CreateProfileDto) {
    const { nickname, birthday, avatar, userId } = payload;

    const user = await this.userService.getUserById(userId); // validate check user existed

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
    newProfile.user = user;

    await this.profileRepository.insert(newProfile);

    return 'Create Profile Successful';
  }

  async updateProfile(profileId: number, payload: UpdateProfileDto) {
    const profile = await this.getProfileById(profileId);

    await this.profileRepository.update(profileId, { ...payload });

    return { ...profile, ...payload };
  }

  async getProfileById(id: number) {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!profile)
      throw new excRpc.BadRequest({ message: 'Profile does not exist!' });
    return profile;
  }

  async loginWithProfile(profileId: number, parentsId: number) {
    const children = await this.getProfileById(profileId);

    if (children.user.id !== parentsId)
      throw new excRpc.BadRequest({
        message: 'Cannot access Profiles that do not belong to you',
      });

    return children;
  }

  async removeProfiles(ids: number[]) {
    // check not existed
    for (const id of ids) {
      await this.getProfileById(id);
    }

    await this.profileRepository.delete(ids);

    return 'Delete successful';
  }
}
