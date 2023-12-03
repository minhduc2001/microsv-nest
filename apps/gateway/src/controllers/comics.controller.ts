import { ParamIdDto, UploadImagesDto } from '@libs/common/dtos/common.dto';
import { ListComicsDto } from '@libs/common/dtos/medias.dto';
import { ApiConsumes, ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as exc from '@libs/common/api';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateComicDto, UpdateComicDto } from '@libs/common/dtos/comics.dto';
import { UploadService } from '@libs/upload';

@Controller('comics')
@ApiTagsAndBearer('Comics')
@Auth()
export class ComicsController {
  constructor(
    @Inject(RabbitServiceName.MEDIA)
    private readonly comicsClientProxy: ClientProxy,
    private readonly uploadService: UploadService,
  ) {}

  // @Post()
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FilesInterceptor('images', 10))
  // async uploadImages(
  //   @Body() dto: UploadImagesDto,
  //   @UploadedFiles() images: Array<Express.Multer.File>,
  // ) {}

  @Get()
  async getListCommic(@Query() query: ListComicsDto) {
    try {
      const resp = await lastValueFrom(
        this.comicsClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.COMICS.LIST_COMICS,
          query,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Get(':id')
  async getComic(@Param() param: ParamIdDto) {
    try {
      const resp = await lastValueFrom(
        this.comicsClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.COMICS.GET_COMICS,
          param.id,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createComic(
    @Body() payload: CreateComicDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    const url = await this.uploadService.uploadFile(thumbnail.filename, 'img');
    try {
      const resp = await lastValueFrom(
        this.comicsClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.COMICS.CREATE_COMIC,
          { ...payload, thumbnail: url },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async updateComic(
    @UploadedFile() thumbnail: Express.Multer.File,
    @Param() params: ParamIdDto,
    @Body() payload: UpdateComicDto,
  ) {
    const url = thumbnail
      ? await this.uploadService.uploadFile(thumbnail.filename, 'img')
      : undefined;
    try {
      const resp = await lastValueFrom(
        this.comicsClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.COMICS.UPDATE_COMIC,
          { id: params.id, body: { ...payload, thumbnail: url } },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }
}
