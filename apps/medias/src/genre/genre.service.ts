import { Genre } from '@libs/common/entities/medias/genre.entity';
import { BaseService } from '@libs/common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as excRpc from '@libs/common/api';
import { CreateGenreDto, UpdateGenreDto } from '@libs/common/dtos/genre.dto';
import { ListDto } from '@libs/common/dtos/common.dto';
import { PaginateConfig } from '@libs/common/services/paginate';

@Injectable()
export class GenreService extends BaseService<Genre> {
  constructor(
    @InjectRepository(Genre) protected repository: Repository<Genre>,
  ) {
    super(repository);
  }

  async getListGenres(query: ListDto) {
    const config: PaginateConfig<Genre> = {
      sortableColumns: ['id'],
    };
    return this.listWithPage(query, config);
  }

  async createGenre(payload: CreateGenreDto) {
    const genre = await this.repository.findOne({
      where: { name: payload.name, type: payload.type },
    });
    if (genre) throw new excRpc.BadRequest({ message: 'Genre had been exist' });

    await this.repository.save({ ...payload });

    return 'Create Genre successful';
  }

  async getGenreById(id: number) {
    const genre = await this.repository.findOne({ where: { id } });
    if (!genre)
      throw new excRpc.BadRequest({ message: 'Genre does not exists' });
    return genre;
  }

  //   async updateGenre(id: number, payload: UpdateGenreDto) {
  //     const exists = await this.repository.findOne({
  //       where: { name: payload.name, type: payload.type },
  //     });
  //     if (exists)
  //       throw new excRpc.BadRequest({ message: 'Genre had been exist' });
  //     const genre = await this.getGenreById(id);

  //   }
}
