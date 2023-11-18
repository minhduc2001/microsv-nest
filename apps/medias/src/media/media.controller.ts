import { Controller } from '@nestjs/common';
import { MediaService } from './media.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import {
  CreateMovieDto,
  ListMovieDto,
  UpdateMovieDto,
} from '@libs/common/dtos/medias.dto';
import { ETypeMedia } from '@libs/common/enums/media.enum';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MOVIE.CREATE_MOVIE)
  async create(@Payload() payload: CreateMovieDto) {
    return this.mediaService.saveMovie(payload);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MOVIE.GET_LIST_MOVIE)
  async list(@Payload() query: ListMovieDto) {
    return this.mediaService.list(query, ETypeMedia.Movies);
  }
  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MOVIE.GET_MOVIE)
  async findOne(@Payload('id') id: number) {
    return this.mediaService.findOne(id, ETypeMedia.Movies);
  }
  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MOVIE.UPDATE_MOVIE)
  async update(@Payload() payload: UpdateMovieDto) {
    return this.mediaService.updateMovie(payload.id, payload);
  }
  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MOVIE.BULK_DELETE_MOVIE)
  async bulkDelete(@Payload('ids') ids: number[]) {
    return this.mediaService.bulkDelete(ids);
  }
}
