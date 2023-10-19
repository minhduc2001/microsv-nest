import { ListComicsDto } from '@libs/common/dtos/medias.dto';
import { Comics } from '@libs/common/entities/medias/comics.entity';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as excRpc from '@libs/common/api';
import { CreateComicDto, UpdateComicDto } from '@libs/common/dtos/comics.dto';
import { GenreService } from '../genre/genre.service';
import { AuthorService } from '../author/author.service';
import _ from 'lodash';

@Injectable()
export class ComicsService extends BaseService<Comics> {
  constructor(
    @InjectRepository(Comics) protected comicsRepository: Repository<Comics>,
    private readonly genreService: GenreService,
    private readonly authorService: AuthorService,
  ) {
    super(comicsRepository);
  }

  async listComics(query: ListComicsDto) {
    const config: PaginateConfig<Comics> = {
      sortableColumns: ['id'],
      // relations: { genres: true, author: true },
    };
    const queryB = this.repository
      .createQueryBuilder('comics')
      .select([
        'comics.id',
        'comics.title',
        'comics.minAge',
        'comics.desc',
        'comics.thumbnail',
        'comics.isAccess',
        'comics.price',
        'comics.views',
        'author.id',
        'author.name',
        'author.image',
        'genres.id',
        'genres.name',
      ])
      .leftJoin('comics.author', 'author')
      .leftJoin('comics.genres', 'genres');
    return this.listWithPage(query, config, queryB);
  }

  async getComicById(id: number) {
    const comic = await this.repository.findOne({
      select: {
        genres: { id: true, name: true },
        author: { id: true, name: true },
      },
      where: { id },
      relations: { genres: true, author: true, chapters: true },
    });
    if (!comic)
      throw new excRpc.BadRequest({ message: 'Comic does not exists' });
    return comic;
  }

  async getComicByIdWithoutRelation(id: number) {
    const comic = await this.repository.findOne({
      where: { id },
    });
    if (!comic)
      throw new excRpc.BadRequest({ message: 'Comic does not exists' });
    return comic;
  }

  async createComic(dto: CreateComicDto) {
    const genres = await this.genreService.getListGenreByIds(dto.genres);
    const author = await this.authorService.getAuthorById(dto.author);

    const { title, minAge, desc, thumbnail, price, isAccess } = dto;

    const newComic = Object.assign(new Comics(), {
      title,
      minAge,
      desc,
      thumbnail,
      price,
      isAccess,
    });
    newComic.author = author;
    newComic.genres = genres;

    await this.repository.save(newComic);

    return 'Create Comic successful';
  }

  async updateComic(id: number, dto: UpdateComicDto) {
    const comic = await this.getComicByIdWithoutRelation(id);
    const { thumbnail, title, minAge, desc, price, isAccess } = dto;
    const basicInfo = { thumbnail, title, minAge, desc, price, isAccess };
    if (dto.genres) {
      const genres = await this.genreService.getListGenreByIds(dto.genres);
      comic.genres = genres;
    }
    if (dto.author) {
      const author = await this.authorService.getAuthorById(dto.author);
      comic.author = author;
    }
    const updateInfo = { ...comic, ...basicInfo };
    await this.comicsRepository.update(comic.id, updateInfo);

    return 'Update Successful';
  }
}
