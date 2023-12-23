import { ApiCreateOperation, ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { User } from '@libs/common/entities/user/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import * as exc from '@libs/common/api';
import * as path from 'path';
import { BuyMediaDto, IdsDto, ParamIdDto } from '@libs/common/dtos/common.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  CreateMusicDto,
  ListMediaDto,
  UpdateMusicDto,
} from '@libs/common/dtos/medias.dto';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '@libs/common/interfaces/common.interface';
import { UploadService } from '@libs/upload';
import { Roles } from '../auth/decorators/role.decorator';
import { ERole } from '@libs/common/enums/role.enum';

@ApiTagsAndBearer('Music')
@Controller('music')
@Auth()
export class MusicController {
  constructor(
    @Inject(RabbitServiceName.MEDIA)
    private readonly mediaClientProxy: ClientProxy,
    private readonly uploadService: UploadService,
  ) {}

  @ApiCreateOperation({ summary: 'Lấy danh sách nhạc' })
  @Get()
  async list(@Query() query: ListMediaDto, @GetUser() user: AuthType) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MUSIC.GET_LIST_MUSIC,
          { ...query, user: user },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Get(':id')
  @ApiCreateOperation({ summary: 'Lấy chi tiết nhạc' })
  async findOne(@Param() param: ParamIdDto, @GetUser() user: AuthType) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MUSIC.GET_MUSIC,
          { ...param, user: user },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiCreateOperation({ summary: 'Tạo mới nhạc' })
  async createMusic(
    @Body() payload: CreateMusicDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    payload.thumbnail = await this.uploadService.uploadFile(
      file.filename,
      'music',
    );

    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MUSIC.CREATE_MUSIC,
          payload,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Post('buy')
  @Roles(ERole.PARENTS)
  @ApiCreateOperation({ summary: 'mua nhac' })
  async buy(@Body() payload: BuyMediaDto, @GetUser() user: User) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(MEDIAS_MESSAGE_PATTERN.MUSIC.BUY, {
          ...payload,
          user: user,
        }),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiCreateOperation({ summary: 'Cập nhật phim' })
  async updateMusic(
    @Param() param: ParamIdDto,
    @Body() payload: UpdateMusicDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file)
      payload.thumbnail = await this.uploadService.uploadFile(
        file.filename,
        'music',
      );

    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MUSIC.UPDATE_MUSIC,
          { ...payload, ...param },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @ApiCreateOperation({ summary: 'do not call this api, please!' })
  @Patch(':id/url')
  async updateUrl(
    @Param() param: ParamIdDto,
    @Body() body: { filename: string },
    @Headers() header: any,
  ) {
    console.log(header);

    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MUSIC.UPDATE_URL_MUSIC,
          { ...param, ...body },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Delete()
  @ApiCreateOperation({ summary: 'Xóa nhiều nhạc' })
  async bulkDelete(@Body() payload: IdsDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MUSIC.BULK_DELETE_MUSIC,
          payload,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }
}
