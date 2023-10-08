import { ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Body, Controller, Inject, Param, Patch, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as exc from '@libs/common/api';
import { firstValueFrom } from 'rxjs';
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import { Auth } from '../auth/decorators/auth.decorator';
import {
  CreateProfileDto,
  UpdateProfileDto,
} from '@libs/common/dtos/profile.dto';
import { ParamIdDto } from '@libs/common/dtos/common.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTagsAndBearer('Profile')
@Controller('profile')
@Auth()
export class ProfileController {
  constructor(
    @Inject(RabbitServiceName.USER) private userClientProxy: ClientProxy,
  ) {}

  @Post()
  async createProfile(
    @Body() body: CreateProfileDto,
    @GetUser('id') userId: number,
  ) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.PROFILE.CREATE_PROFILE,
          { ...body, userId },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }

  @Patch(':id')
  async updateProfile(
    @Param() params: ParamIdDto,
    @Body() body: UpdateProfileDto,
  ) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.PROFILE.UPDATE_PROFILE,
          { profileId: params.id, body },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }
}
