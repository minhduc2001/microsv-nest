import * as excRpc from '@libs/common/api';
import { Controller } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { ListDto } from '@libs/common/dtos/common.dto';
import { CreateChapterDto } from '@libs/common/dtos/comics.dto';
import { ListChapterDto } from '@libs/common/dtos/chapter.dto';

@Controller()
export class ChapterController {
  constructor(private readonly service: ChapterService) {}

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.CHAPTER.LIST_CHAPTER)
  async getListChapter(@Payload() query: ListChapterDto) {
    return await this.service.getListChapter(query);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.CHAPTER.GET_CHAPTER)
  async getChapter(@Payload() id: number) {
    return await this.service.getChapterById(id);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.CHAPTER.CREATE_CHAPTER)
  async createChapter(@Payload() dto: CreateChapterDto) {
    return await this.service.createChapter(dto);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.CHAPTER.DELETE)
  async bulkDelete(@Payload('ids') ids: number[]) {
    return this.service.bulkDelete(ids);
  }
}
