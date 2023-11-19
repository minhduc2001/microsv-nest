import { Controller } from '@nestjs/common';
import { MediaService } from './media.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import {
  CreateMovieDto,
  ListMediaDto,
  UpdateMovieDto,
} from '@libs/common/dtos/medias.dto';
import { ETypeMedia } from '@libs/common/enums/media.enum';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MOVIE.CREATE_MOVIE)
  async createMovie(@Payload() payload: CreateMovieDto) {
    return this.mediaService.saveMovie(payload);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MOVIE.GET_LIST_MOVIE)
  async listMovie(@Payload() query: ListMediaDto) {
    return this.mediaService.list(query, ETypeMedia.Movies);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MOVIE.GET_MOVIE)
  async findOneMovie(@Payload('id') id: number) {
    return this.mediaService.findOne(id, ETypeMedia.Movies);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MOVIE.UPDATE_MOVIE)
  async updateMovie(@Payload() payload: UpdateMovieDto) {
    return this.mediaService.updateMovie(payload.id, payload);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MOVIE.BULK_DELETE_MOVIE)
  async bulkDeleteMovie(@Payload('ids') ids: number[]) {
    return this.mediaService.bulkDelete(ids, ETypeMedia.Movies);
  }

  // music
  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MUSIC.CREATE_MUSIC)
  async create(@Payload() payload: CreateMovieDto) {
    return this.mediaService.saveMusic(payload);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MUSIC.GET_LIST_MUSIC)
  async list(@Payload() query: ListMediaDto) {
    return this.mediaService.list(query, ETypeMedia.Music);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MUSIC.GET_MUSIC)
  async findOne(@Payload('id') id: number) {
    return this.mediaService.findOne(id, ETypeMedia.Music);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MUSIC.UPDATE_MUSIC)
  async update(@Payload() payload: UpdateMovieDto) {
    return this.mediaService.updateMusic(payload.id, payload);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.MUSIC.BULK_DELETE_MUSIC)
  async bulkDelete(@Payload('ids') ids: number[]) {
    return this.mediaService.bulkDelete(ids, ETypeMedia.Music);
  }
}
