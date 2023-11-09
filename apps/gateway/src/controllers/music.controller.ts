import { ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { User } from '@libs/common/entities/user/user.entity';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import * as exc from '@libs/common/api';
import * as path from 'path';
import { ParamIdDto } from '@libs/common/dtos/common.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { ERole } from '@libs/common/enums/role.enum';
import {
  CreateMusicDto,
  ListMusicDto,
  UpdateMusicDto,
} from '@libs/common/dtos/medias.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { Auth } from '../auth/decorators/auth.decorator';

@ApiTagsAndBearer('Music')
@Controller('music')
@Auth()
export class MusicController {
  constructor(
    @Inject(RabbitServiceName.MEDIA) private mediaClientProxy: ClientProxy,
    @Inject(RabbitServiceName.FILE) private fileClientProxy: ClientProxy,
  ) {}
  @ApiOperation({ summary: 'lấy danh sách music' })
  @Get()
  async listAudioBook(@Query() query: ListMusicDto, @GetUser() user: User) {
    try {
      const resp = await lastValueFrom(
        this.mediaClientProxy.send(
          MEDIAS_MESSAGE_PATTERN.MUSIC.GET_LIST_MUSIC,
          { ...query, profileId: user.id },
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

  @ApiOperation({ summary: 'Lấy chi tiết music' })
  @Get(':id')
  async getAudioBook(@Param() param: ParamIdDto, @GetUser() user: User) {
    try {
      const resp = await lastValueFrom(
        this.mediaClientProxy.send(
          MEDIAS_MESSAGE_PATTERN.MUSIC.GET_LIST_MUSIC,
          { ...param, profileId: user.id },
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

  @ApiOperation({ summary: 'Tạo music' })
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'music', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  @UseGuards(RolesGuard)
  @Roles(ERole.ADMIN)
  async createAudioBook(
    @Body() dto: CreateMusicDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File; audio?: Express.Multer.File },
  ) {
    try {
      const resp = await lastValueFrom(
        this.mediaClientProxy.send(MEDIAS_MESSAGE_PATTERN.MUSIC.CREATE_MUSIC, {
          ...dto,
        }),
      );

      return resp;
    } catch (e) {
      //   this.logger.warn(e.message);
      //   this.fileService.removeFile(files.audio[0].filename, 'audio');
      //   this.fileService.removeFile(files.image[0].filename, 'uploads');
      throw new exc.CustomError({
        message: e.message,
        statusCode: e?.status ?? e,
      });
    }
  }

  @Public()
  @ApiOperation({ summary: 'yêu thích' })
  @Post('like')
  async like() {
    const resp = await this.fileClientProxy
      .send('file.convert', {})
      .toPromise();
    console.log(resp);

    // return this.service.like(dto.id, user);
    return 'haha';
  }

  @ApiOperation({ summary: 'sửa audio book' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(ERole.ADMIN)
  async updateAudioBook(
    @Body() dto: UpdateMusicDto,
    @Param() param: ParamIdDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File; audio?: Express.Multer.File },
  ) {
    try {
    } catch (e) {
      //   this.logger.warn(e.message);

      //   this.fileService.removeFile(files.audio[0].filename, 'audio');
      //   this.fileService.removeFile(files.image[0].filename, 'uploads');

      throw new exc.CustomError({
        message: e.message,
        statusCode: e?.status ?? e,
      });
    }
  }
}
