import { Genre } from '@libs/common/entities/medias/genre.entity';
import { BaseService } from '@libs/common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as excRpc from '@libs/common/api';
import {
  CreateGenreDto,
  ListGenreDto,
  UpdateGenreDto,
} from '@libs/common/dtos/genre.dto';
import { ListDto } from '@libs/common/dtos/common.dto';
import { PaginateConfig } from '@libs/common/services/paginate';
import { ETypeGenre, ETypeMedia } from '@libs/common/enums/media.enum';
import { EState } from '@libs/common/enums/common.enum';

@Injectable()
export class GenreService extends BaseService<Genre> {
  constructor(
    @InjectRepository(Genre) protected repository: Repository<Genre>,
  ) {
    super(repository);
  }

  async getListGenres(query: ListDto) {
    const config: PaginateConfig<Genre> = {
      defaultSortBy: [['updatedAt', 'DESC']],
      sortableColumns: ['id'],
      searchableColumns: ['name'],
    };
    return this.listWithPage(query, config);
  }

  async getListGenresGR(query: ListGenreDto) {
    const config: PaginateConfig<Genre> = {
      defaultSortBy: [['updatedAt', 'DESC']],
      sortableColumns: ['id'],
      searchableColumns: ['name'],
      where: { type: query.type as number },
    };

    const queryB = this.repository
      .createQueryBuilder('genre')
      .leftJoinAndSelect('genre.medias', 'media')
      .where('media.state = :state', { state: EState.Active });
    // .andWhere('genre.type', { type: query.type as number });
    return this.listWithPage(query, config, queryB);
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

  async getListGenreByIds(ids: number[]) {
    const genres = ids.map(async (id) => {
      return await this.getGenreById(id);
    });
    const result = await Promise.all(genres);
    return result;
  }

  async updateGenre(id: number, payload: UpdateGenreDto) {
    const exists = await this.repository.findOne({
      where: { name: payload.name, type: payload.type },
    });
    if (exists)
      throw new excRpc.BadRequest({ message: 'Genre had been exist' });
    const genre = await this.getGenreById(id);

    genre.name = payload.name;
    genre.type = payload.type;

    await this.repository.save(genre);

    return 'Update genre successful!';
  }
}
