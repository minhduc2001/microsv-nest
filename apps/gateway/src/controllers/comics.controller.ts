import { UploadImagesDto } from '@libs/common/dtos/common.dto';
import { ListComicsDto } from '@libs/common/dtos/medias.dto';
import { ApiConsumes, ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as exc from '@libs/common/api';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';

@Controller('comics')
@ApiTagsAndBearer('Comics')
export class ComicsController {
  constructor(
    @Inject(RabbitServiceName.MEDIA)
    private readonly comicsClientProxy: ClientProxy,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(
    @Body() dto: UploadImagesDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {}

  @Get()
  async listComics(@Query() query: ListComicsDto) {
    try {
      const data = await lastValueFrom(
        this.comicsClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.COMICS.LIST_COMICS,
          query,
        ),
      );
      return data;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }
}
