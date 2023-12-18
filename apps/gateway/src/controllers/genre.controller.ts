import { ApiCreateOperation, ApiTagsAndBearer } from '@libs/common/swagger-ui';
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
import {
  CreateGenreDto,
  ListGenreDto,
  UpdateGenreDto,
} from '@libs/common/dtos/genre.dto';
import { ListDto, ParamIdDto } from '@libs/common/dtos/common.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTagsAndBearer('Genre')
@Controller('genre')
@Auth()
export class GenreController {
  constructor(
    @Inject(RabbitServiceName.MEDIA) private mediaClientProxy: ClientProxy,
  ) {}

  @Get()
  @ApiCreateOperation({ summary: 'Lấy danh sách thể loại' })
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
      throw new exc.CustomError(e);
    }
  }

  @ApiCreateOperation({ summary: 'Lấy danh sách thể loại của truyện' })
  @Get('/comic')
  async getListGenreComic(@Query() query: ListDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.GENRE.GET_LIST_GENRES_COMIC,
          query,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Get('movie')
  @ApiCreateOperation({ summary: 'Lấy danh sách thể loại của phim' })
  async getListGenreMovie(@Query() query: ListDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.GENRE.GET_LIST_GENRES_MOVIE,
          query,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @ApiCreateOperation({ summary: 'Lấy danh sách thể loại của nhạc' })
  @Get('music')
  async getListGenreMusic(@Query() query: ListDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.GENRE.GET_LIST_GENRES_MUSIC,
          query,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @ApiCreateOperation({ summary: 'Lấy danh sách thể loại của nhạc' })
  @Get('list/gr')
  @Public()
  async getMusicGroupBy(@Query() query: ListGenreDto) {
    try {
      if (!query.type) query.type = 1;
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.GENRE.GET_GENRES_GR,
          query,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Get(':id')
  @ApiCreateOperation({ summary: 'Lấy chi tiết 1 thể loại' })
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
      throw new exc.CustomError(e);
    }
  }

  @Post()
  @Public()
  @ApiCreateOperation({ summary: 'Tạo mới 1 thể loại' })
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
      throw new exc.CustomError(e);
    }
  }

  @Patch(':id')
  @ApiCreateOperation({ summary: 'Cập nhật thể loại' })
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
      throw new exc.CustomError(e);
    }
  }
}
