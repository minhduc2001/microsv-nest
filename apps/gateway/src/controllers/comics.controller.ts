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
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateComicDto } from '@libs/common/dtos/comics.dto';

@Controller('comics')
@ApiTagsAndBearer('Comics')
@Auth()
export class ComicsController {
  constructor(
    @Inject(RabbitServiceName.MEDIA)
    private readonly comicsClientProxy: ClientProxy,
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
      throw new exc.BadException({ message: e.message ?? e });
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
      throw new exc.BadException({ message: e.message ?? e });
    }
  }

  @Post()
  async createComic(@Body() payload: CreateComicDto) {
    try {
      const resp = await lastValueFrom(
        this.comicsClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.COMICS.CREATE_COMIC,
          payload,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.BadException({ message: e.message ?? e });
    }
  }
}
