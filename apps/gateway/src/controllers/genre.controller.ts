import { ApiTagsAndBearer } from '@libs/common/swagger-ui';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import * as exc from '@libs/common/api';
import { CreateGenreDto, UpdateGenreDto } from '@libs/common/dtos/genre.dto';
import { ListDto, ParamIdDto } from '@libs/common/dtos/common.dto';

@ApiTagsAndBearer('Genre')
@Controller('genre')
@Auth()
export class GenreController {
  constructor(
    @Inject(RabbitServiceName.MEDIA) private mediaClientProxy: ClientProxy,
  ) {}

  @Get()
  async getListGenre(@Query() query: ListDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.GENRE.GET_LIST_GENRES,
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
  async getGenre(@Param() params: ParamIdDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.GENRE.GET_GENRE,
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
  async createGenre(@Body() payload: CreateGenreDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.GENRE.CREATE_GENRE,
          payload,
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

  @Patch(':id')
  async updateGenre(
    @Param() param: ParamIdDto,
    @Body() payload: UpdateGenreDto,
  ) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.GENRE.UPDATE_GENRE,
          {
            id: param.id,
            payload,
          },
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
