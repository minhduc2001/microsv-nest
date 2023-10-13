import * as excRpc from '@libs/common/api';
import { CreateAuthorDto } from '@libs/common/dtos/author.dto';
import { ListDto } from '@libs/common/dtos/common.dto';
import { Author } from '@libs/common/entities/medias/author.entity';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorService extends BaseService<Author> {
  constructor(
    @InjectRepository(Author) protected repository: Repository<Author>,
  ) {
    super(repository);
  }

  async createAuthor(payload: CreateAuthorDto) {
    const exists = await this.repository.findOne({
      where: { name: payload.name },
    });
    if (exists)
      throw new excRpc.BadRequest({ message: 'Author had been exist' });

    await this.repository.save({ ...payload });

    return 'Create Author Successful';
  }

  async getAuthorById(id: number) {
    const author = await this.repository.findOne({ where: { id } });
    if (!author)
      throw new excRpc.BadRequest({ message: 'Author does not exists' });
    return author;
  }

  async getListAuthors(query: ListDto) {
    const config: PaginateConfig<Author> = {
      sortableColumns: ['id'],
    };
    return this.listWithPage(query, config);
  }
}
