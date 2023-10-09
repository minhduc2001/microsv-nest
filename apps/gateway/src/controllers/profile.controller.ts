import { ApiConsumes, ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as exc from '@libs/common/api';
import { firstValueFrom } from 'rxjs';
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import { Auth } from '../auth/decorators/auth.decorator';
import {
  CreateProfileDto,
  UpdateProfileDto,
} from '@libs/common/dtos/profile.dto';
import { IdsDto, ParamIdDto } from '@libs/common/dtos/common.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTagsAndBearer('Profile')
@Controller('profile')
@Auth()
export class ProfileController {
  constructor(
    @Inject(RabbitServiceName.USER) private userClientProxy: ClientProxy,
  ) {}

  @Get()
  async getAllProfileOfLoginUser(@GetUser('id') userId: number) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.PROFILE.GET_ALL_PROFILE_BY_USER_ID,
          userId,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }

  @Get(':id')
  async getProfileById(@Param() params: ParamIdDto) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.PROFILE.GET_PROFILE,
          params.id,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  async createProfile(
    @Body() body: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser('id') userId: number,
  ) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.PROFILE.CREATE_PROFILE,
          { ...body, userId, avatar: file.filename },
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

  @Delete()
  async removeProfiles(@Body() payload: IdsDto) {
    try {
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.PROFILE.DELETE_PROFILE,
          payload.ids,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }
}
