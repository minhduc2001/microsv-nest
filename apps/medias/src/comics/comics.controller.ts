import { Controller } from '@nestjs/common';
import { ComicsService } from './comics.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ListComicsDto } from '@libs/common/dtos/medias.dto';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { UpdateComicDto } from '@libs/common/dtos/comics.dto';
import { BuyMediaDto } from '@libs/common/dtos/common.dto';

@Controller()
export class ComicsController {
  constructor(private readonly comicsService: ComicsService) {}

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.COMICS.LIST_COMICS)
  async listComics(@Payload() query: ListComicsDto) {
    return await this.comicsService.listComics(query);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.COMICS.CREATE_COMIC)
  async createComic(@Payload() payload: any) {
    return await this.comicsService.createComic(payload);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.COMICS.GET_COMICS)
  async getComic(@Payload() payload: any) {
    return await this.comicsService.getComicById(payload.id, payload.user);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.COMICS.UPDATE_COMIC)
  async updateComic(
    @Payload('id') id: number,
    @Payload('body') payload: UpdateComicDto,
  ) {
    return this.comicsService.updateComic(id, payload);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.COMICS.BUY)
  async buy(@Payload() payload: BuyMediaDto) {
    return this.comicsService.buy(payload.id, payload.user);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.COMICS.REMOVE_COMIC)
  async bulkDelete(@Payload('ids') ids: number[]) {
    return this.comicsService.bulkDelete(ids);
  }
}
