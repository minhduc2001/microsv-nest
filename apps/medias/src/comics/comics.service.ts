import { ListComicsDto } from '@libs/common/dtos/medias.dto';
import { Comics } from '@libs/common/entities/medias/comics.entity';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository } from 'typeorm';
import * as excRpc from '@libs/common/api';
import { CreateComicDto, UpdateComicDto } from '@libs/common/dtos/comics.dto';
import { GenreService } from '../genre/genre.service';
import { AuthorService } from '../author/author.service';
import _ from 'lodash';
import { ETypeMedia } from '@libs/common/enums/media.enum';
import {
  IPrepareMediaData,
  IPrepareMediaDataOptions,
} from '@libs/common/interfaces/media.interface';
import { Genre } from '@libs/common/entities/medias/genre.entity';
import { Author } from '@libs/common/entities/medias/author.entity';
import { ERole } from '@libs/common/enums/role.enum';
import { EState } from '@libs/common/enums/common.enum';
import { Profile } from '@libs/common/entities/user/profile.entity';

@Injectable()
export class ComicsService extends BaseService<Comics> {
  constructor(
    @InjectRepository(Comics) protected comicsRepository: Repository<Comics>,
    private readonly genreService: GenreService,
    private readonly authorService: AuthorService,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
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
      .andWhere(
        query.user.role !== ERole.ADMIN
          ? { state: EState.Active }
          : { state: Not(EState.Deleted) },
      )
      .andWhere(
        query.user.role === ERole.CHILDRENS
          ? { minAge: LessThan(this._getAge((query.user as Profile).birthday)) }
          : {},
      )
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
      .leftJoin('comics.genres', 'genres')
      .leftJoin('comics.chapters', 'chapter')
      .loadRelationCountAndMap('comics.chaptersCount', 'comics.chapters');
    return this.listWithPage(query, config, queryB);
  }

  async getComicById(id: number) {
    const comic = await this.repository.findOne({
      select: {
        genres: { id: true, name: true },
        authors: { id: true, name: true },
      },
      where: { id },
      relations: { genres: true, authors: true },
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
    const { authors, genres } = await this._prepare({
      genre_ids: dto.genreIds,
      author_ids: dto.authorIds,
    });

    const newComic = this.comicsRepository.create(dto);
    newComic.authors = authors;
    newComic.genres = genres;

    await newComic.save();

    return 'Create Comic successful';
  }

  async updateComic(id: number, dto: UpdateComicDto) {
    const comic = await this.getComicByIdWithoutRelation(id);
    const { thumbnail, title, minAge, desc, golds, state } = dto;
    const basicInfo = { thumbnail, title, minAge, desc, golds, state };
    const { authors, genres } = await this._prepare({
      genre_ids: dto.genreIds,
      author_ids: dto.authorIds,
    });
    const updateInfo = { ...comic, ...basicInfo, authors, genres };
    await this.comicsRepository.update(comic.id, updateInfo);

    return 'Update Successful';
  }

  async bulkDelete(ids: number[]) {
    for (const id of ids) {
      await this.repository.update({ id: id }, { state: EState.Deleted });
    }
    return true;
  }

  private async _prepare({
    genre_ids = [],
    author_ids = [],
    type = ETypeMedia.Comics,
  }: IPrepareMediaDataOptions): Promise<IPrepareMediaData> {
    let genres: Genre[] = [];
    let authors: Author[] = [];

    if (genre_ids?.length) {
      genres = await this.genreRepository
        .createQueryBuilder('genre')
        .where('genre.id IN (:...genre_ids)', { genre_ids })
        .andWhere('genre.type = :type', { type })
        .select(['genre.id', 'genre.type'])
        .getMany();
    }

    if (author_ids?.length) {
      authors = await this.authorRepository
        .createQueryBuilder('author')
        .where('author.id IN (:...author_ids)', { author_ids })
        .andWhere('author.type = :type', { type })
        .select(['author.id', 'author.type'])
        .getMany();
    }

    return { genres, authors };
  }

  private _getAge(birthday: any) {
    const today = new Date();
    const birthDate = new Date(birthday);
    const age =
      (today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    return Math.floor(age);
  }
}
