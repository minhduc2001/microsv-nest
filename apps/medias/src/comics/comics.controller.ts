import { Controller } from '@nestjs/common';
import { ComicsService } from './comics.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ListComicsDto } from '@libs/common/dtos/medias.dto';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import * as excRpc from '@libs/common/api';

@Controller()
export class ComicsController {
  constructor(private readonly comicsService: ComicsService) {}

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.COMICS.LIST_COMICS)
  async listComics(@Payload() query: ListComicsDto) {
    try {
      return this.comicsService.listComics(query);
    } catch (e) {
      throw new excRpc.BadRequest({ message: e.message });
    }
  }
}
