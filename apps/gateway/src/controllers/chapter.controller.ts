import { ApiConsumes, ApiTagsAndBearer } from '@libs/common/swagger-ui';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';
import * as exc from '@libs/common/api';
import { ListDto, ParamIdDto } from '@libs/common/dtos/common.dto';
import { firstValueFrom } from 'rxjs';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { Public } from '../auth/decorators/public.decorator';
import { CreateChapterDto } from '@libs/common/dtos/comics.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from '@libs/upload';
import { ComicsImageurl } from '@libs/common/interfaces/common.interface';

@ApiTagsAndBearer('Chapter')
@Controller('chapter')
@Auth()
export class ChapterController {
  constructor(
    @Inject(RabbitServiceName.MEDIA) private mediaClientProxy: ClientProxy,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  async getListChapter(@Query() query: ListDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.CHAPTER.LIST_CHAPTER,
          query,
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
  async getChapter(@Param() params: ParamIdDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.CHAPTER.GET_CHAPTER,
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

  @Post()
  @Public()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('imageUrls', 20))
  async createChapter(
    @Body() payload: CreateChapterDto,
    @UploadedFiles() imageUrls: Array<Express.Multer.File>,
  ) {
    try {
      const urls = await this.uploadService.uploadMultipeFile(
        imageUrls.map((image) => image.fieldname),
      );
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.CHAPTER.CREATE_CHAPTER,
          { ...payload, imageUrls: urls.map((url, index) => ({ url, index })) },
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
