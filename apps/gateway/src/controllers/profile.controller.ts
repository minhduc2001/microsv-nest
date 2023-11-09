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
  LoginProfileDto,
  UpdateProfileDto,
} from '@libs/common/dtos/profile.dto';
import { IdsDto, ParamIdDto } from '@libs/common/dtos/common.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '@libs/upload';
import { UserService } from '../services/user.service';
import { User } from '@libs/common/entities/user/user.entity';

@ApiTagsAndBearer('Profile')
@Controller('profile')
@Auth()
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    @Inject(RabbitServiceName.USER) private userClientProxy: ClientProxy,
    private uploadService: UploadService,
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
      throw new exc.CustomError({
        message: e.message,
        statusCode: e?.status ?? e,
      });
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
      throw new exc.CustomError({
        message: e.message,
        statusCode: e?.status ?? e,
      });
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
      const avatarUrl = file
        ? await this.uploadService.uploadFile(file.filename, 'user')
        : null;
      const resp = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.PROFILE.CREATE_PROFILE,
          { ...body, userId, avatar: avatarUrl },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError({
        message: e.message,
        statusCode: e?.status ?? e,
      });
    }
  }

  @Post('login')
  async loginWithProfile(
    @Body() payload: LoginProfileDto,
    @GetUser() user: User,
  ) {
    try {
      const data = await firstValueFrom(
        this.userClientProxy.send<any>(
          USER_MESSAGE_PATTERNS.PROFILE.LOGIN_WITH_PROFILE,
          { profileId: payload.id, parentsId: user.id },
        ),
      );

      const tokens = await this.userService.getTokens({
        sub: data.id,
        parentId: user.id,
      });

      return {
        ...data,
        ...tokens,
      };
    } catch (e) {
      throw new exc.CustomError({
        message: e.message,
        statusCode: e?.status ?? e,
      });
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
      throw new exc.CustomError({
        message: e.message,
        statusCode: e?.status ?? e,
      });
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
      throw new exc.CustomError({
        message: e.message,
        statusCode: e?.status ?? e,
      });
    }
  }
}
