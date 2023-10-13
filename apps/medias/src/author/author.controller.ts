import { Controller } from '@nestjs/common';
import { AuthorService } from './author.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { CreateAuthorDto } from '@libs/common/dtos/author.dto';
import { ListDto } from '@libs/common/dtos/common.dto';

@Controller()
export class AuthorController {
  constructor(private readonly service: AuthorService) {}

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.AUTHOR.CREATE_AUTHOR)
  async createAuthor(@Payload() payload: CreateAuthorDto) {
    return await this.service.createAuthor(payload);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.AUTHOR.GET_AUTHOR)
  async getAuthor(@Payload() id: number) {
    return await this.service.getAuthorById(id);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.AUTHOR.GET_LIST_AUTHOR)
  async getListAuthor(@Payload() query: ListDto) {
    return await this.service.getListAuthors(query);
  }

  @MessagePattern(MEDIAS_MESSAGE_PATTERN.AUTHOR.UPDATE_AUTHOR)
  async updateGenre() {
    console.log('TBD');

    // return await this.service.
  }
}
