import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import * as excRpc from '@libs/common/api';
import { ProfileService } from '../services/profile.service';
import {
  CreateProfileDto,
  UpdateProfileDto,
} from '@libs/common/dtos/profile.dto';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern(USER_MESSAGE_PATTERNS.PROFILE.GET_ALL_PROFILE_BY_USER_ID)
  async getAllProfileByUserId(@Payload() userId: number) {
    try {
      return this.profileService.getAllProfileByUserId(userId);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.PROFILE.GET_PROFILE)
  async getProfileById(@Payload() profileId: number) {
    try {
      return this.profileService.getProfileById(profileId);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.PROFILE.CREATE_PROFILE)
  async createProfile(@Payload() newProfile: CreateProfileDto) {
    try {
      return this.profileService.createProfile(newProfile);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.PROFILE.UPDATE_PROFILE)
  async updateProfile(
    @Payload('profileId') profileId: number,
    @Payload('body') body: UpdateProfileDto,
  ) {
    try {
      return this.profileService.updateProfile(profileId, body);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.PROFILE.DELETE_PROFILE)
  async removeProfiles(@Payload() ids: number[]) {
    try {
      return this.profileService.removeProfiles(ids);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.PROFILE.LOGIN_WITH_PROFILE)
  async loginWithProfile(
    @Payload('profileId') profileId: number,
    @Payload('parentsId') parentsId: number,
  ) {
    try {
      return this.profileService.loginWithProfile(profileId, parentsId);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }
}
