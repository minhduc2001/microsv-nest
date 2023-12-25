import {
  ApiConsumes,
  ApiCreateOperation,
  ApiTagsAndBearer,
} from '@libs/common/swagger-ui';
import {
  Body,
  Controller,
  Delete,
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
import { IdsDto, ListDto, ParamIdDto } from '@libs/common/dtos/common.dto';
import { firstValueFrom } from 'rxjs';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { Public } from '../auth/decorators/public.decorator';
import { CreateChapterDto } from '@libs/common/dtos/comics.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from '@libs/upload';

@ApiTagsAndBearer('Chapter')
@Controller('chapter')
@Auth()
export class ChapterController {
  constructor(
    @Inject(RabbitServiceName.MEDIA) private mediaClientProxy: ClientProxy,
    private readonly uploadService: UploadService,
  ) {}

  @Get(':id')
  @ApiCreateOperation({ summary: 'Lấy danh sách chương truyện của 1 truyện' })
  async getListChapter(@Query() query: ListDto, @Param() param: ParamIdDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.CHAPTER.LIST_CHAPTER,
          { ...query, ...param },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Get(':id/detail')
  @ApiCreateOperation({ summary: 'Lấy chi tiết 1 chương truyện' })
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
      throw new exc.CustomError(e);
    }
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 20))
  @ApiCreateOperation({ summary: 'Tạo mới 1 chương truyện' })
  async createChapter(
    @Body() payload: CreateChapterDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    try {
      const urls = await this.uploadService.uploadMultipeFile(
        images.map((image) => image.filename),
      );

      delete payload.images;

      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.CHAPTER.CREATE_CHAPTER,
          {
            ...payload,
            imageUrl: urls.map((url, index) => ({
              url,
              index: index + 1,
            })),
          },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Delete()
  @ApiCreateOperation({ summary: 'Xóa nhiều chapter' })
  async bulkDelete(@Body() payload: IdsDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.CHAPTER.DELETE,
          payload,
        ),
      );

      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }
}
