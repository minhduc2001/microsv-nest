import * as excRpc from '@libs/common/api';
import { CreateAuthorDto, UpdateAuthorDto } from '@libs/common/dtos/author.dto';
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

  async getListAuthorByIds(ids: number[]) {
    const authors = ids.map(async (id) => {
      return await this.getAuthorById(id);
    });
    const result = await Promise.all(authors);
    return result;
  }

  async getListAuthors(query: ListDto) {
    const config: PaginateConfig<Author> = {
      sortableColumns: ['id'],
      searchableColumns: ['name', 'description'],
    };
    return this.listWithPage(query, config);
  }

  async updateAuthor(id: number, payload: UpdateAuthorDto) {
    const author = await this.getAuthorById(id);
    console.log(payload);

    if (payload.name || payload.type) {
      const exists = await this.repository.findOne({
        where: {
          name: payload.name ? payload.name : author.name,
          type: payload.type ? payload.type : author.type,
        },
      });

      if (exists)
        throw new excRpc.BadRequest({ message: 'Author had been exist' });
    }

    const authorUpdated = Object.assign(new Author(), {
      ...author,
      ...payload,
    });

    await this.repository.update({ id: author.id }, authorUpdated);

    return 'Cập nhật thông tin tác giả thành công!';
  }
}
