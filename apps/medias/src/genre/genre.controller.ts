import { Controller } from '@nestjs/common';
import { GenreService } from './genre.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { CreateGenreDto, UpdateGenreDto } from '@libs/common/dtos/genre.dto';
import { ListDto } from '@libs/common/dtos/common.dto';
import { ETypeGenreMedia } from '@libs/common/enums/media.enum';

@Controller()
export class GenreController {
  constructor(private readonly service: GenreService) {}

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.GENRE.CREATE_GENRE)
  async createGenre(@Payload() payload: CreateGenreDto) {
    return await this.service.createGenre(payload);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.GENRE.GET_GENRE)
  async getGenre(@Payload() id: number) {
    return await this.service.getGenreById(id);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.GENRE.GET_LIST_GENRES)
  async getListGenre(@Payload() query: ListDto) {
    return await this.service.getListGenres(query);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.GENRE.GET_LIST_GENRES_COMIC)
  async getListGenreComic(@Payload() query: ListDto) {
    query.filter = JSON.stringify({ type: '0' }) as any;
    return await this.service.getListGenres(query);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.GENRE.GET_LIST_GENRES_MOVIE)
  async getListGenreMovie(@Payload() query: ListDto) {
    query.filter = JSON.stringify({ type: '2' }) as any;
    return await this.service.getListGenres(query);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.GENRE.GET_LIST_GENRES_MUSIC)
  async getListGenreMusic(@Payload() query: ListDto) {
    query.filter = JSON.stringify({ type: '1' }) as any;
    return await this.service.getListGenres(query);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.GENRE.UPDATE_GENRE)
  async updateGenre(
    @Payload('id') id: number,
    @Payload('payload') payload: UpdateGenreDto,
  ) {
    return await this.service.updateGenre(id, payload);
  }
}
