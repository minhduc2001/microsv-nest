import { ListComicsDto } from '@libs/common/dtos/medias.dto';
import { Comics } from '@libs/common/entities/medias/comics.entity';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { Inject, Injectable } from '@nestjs/common';
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
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@libs/common/entities/user/user.entity';
import {
  ACTIONS_MESSAGE_PATTERN,
  USER_MESSAGE_PATTERNS,
} from '@libs/common/constants/rabbit-patterns.constant';
import { AuthType } from '@libs/common/interfaces/common.interface';

@Injectable()
export class ComicsService extends BaseService<Comics> {
  constructor(
    @InjectRepository(Comics) protected comicsRepository: Repository<Comics>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @Inject(RabbitServiceName.ACTIONS)
    private readonly libClientProxy: ClientProxy,
    @Inject(RabbitServiceName.USER)
    private readonly userClientProxy: ClientProxy,
  ) {
    super(comicsRepository);
  }

  async prepareResponse(comics: Comics[], user: AuthType) {
    const [libBought, libLike, libPlaylist]: [any, any, any] =
      await Promise.all([
        this.libClientProxy
          .send<any>(
            ACTIONS_MESSAGE_PATTERN.LIBRARY.LIST_LIBRARY_CHILD_BY_USER_NAME,
            { name: 'Đã mua', userId: user.id },
          )
          .toPromise(),
        this.libClientProxy
          .send<any>(
            ACTIONS_MESSAGE_PATTERN.LIBRARY.LIST_LIBRARY_CHILD_BY_USER_NAME,
            { name: 'Yêu thích', userId: user.id },
          )
          .toPromise(),
        this.libClientProxy
          .send<any>(
            ACTIONS_MESSAGE_PATTERN.LIBRARY.LIST_LIBRARY_CHILD_BY_USER_NAME,
            { name: 'Danh sách phát', userId: user.id },
          )
          .toPromise(),
      ]);

    const idBuys = libBought.results.map((lib) => {
      return lib.comicsId;
    });

    const idLike = libLike.results.map((lib) => {
      return lib.comicsId;
    });

    const idPlaylist: number[] = libPlaylist.results.map((lib) => {
      return lib.comicsId;
    });

    for (const comic of comics) {
      if (idBuys.includes(comic.id)) comic.isAccess = true;
      if (idLike.includes(comic.id)) comic.isLike = true;
      if (idPlaylist.includes(comic.id)) comic.isPlaylist = true;
    }
  }

  async listComics(query: ListComicsDto) {
    const config: PaginateConfig<Comics> = {
      sortableColumns: ['id'],
      searchableColumns: ['title'],
      relations: { genres: true, authors: true },
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
      // .select([
      //   'comics.id',
      //   'comics.title',
      //   'comics.minAge',
      //   'comics.desc',
      //   'comics.thumbnail',
      //   'comics.golds',
      //   'comics.views',
      //   'comics.likes',
      //   'authors.id',
      //   'authors.name',
      //   'authors.image',
      //   'genres.id',
      //   'genres.name',
      //   'comics.state',
      //   'comics.publishDate',
      // ])
      // .leftJoinAndSelect('comics.authors', 'authors')
      // .leftJoinAndSelect('comics.genres', 'genres')
      // .leftJoin('comics.chapters', 'chapters')
      .loadRelationCountAndMap('comics.chaptersCount', 'comics.chapters');
    const results = await this.listWithPage(query, config, queryB);
    await this.prepareResponse(results.results, query.user);
    return results;
  }

  async getComicById(id: number, user?: AuthType) {
    const comic = await this.repository.findOne({
      select: {
        genres: { id: true, name: true },
        authors: { id: true, name: true },
      },
      where: { id, state: Not(EState.Deleted) },
      relations: { genres: true, authors: true },
    });

    if (!comic)
      throw new excRpc.BadRequest({ message: 'Comic does not exists' });

    comic.views += 1;
    comic.save();

    if (user) {
      await this.prepareResponse([comic], user);
    }
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

    const { authors, genres } = await this._prepare({
      genre_ids: dto.genreIds,
      author_ids: dto.authorIds,
    });

    const updateInfo = { ...comic, ...dto, authors, genres };
    await this.comicsRepository.update(comic.id, updateInfo);

    return 'Update Successful';
  }

  async bulkDelete(ids: number[]) {
    for (const id of ids) {
      await this.repository.update({ id: id }, { state: EState.Deleted });
    }
    return true;
  }

  async buy(mediaId: number, user: User) {
    const media = await this.repository.findOne({ where: { id: mediaId } });
    if (!media)
      throw new excRpc.BadException({
        message: 'Không có sản phẩm này!',
      });

    if (media.golds === 0)
      throw new excRpc.BadException({
        message: 'Sản phẩm này không mất phí!',
      });

    if (user.golds < media.golds) {
      throw new excRpc.BadException({
        message: 'Bạn không đủ xu!',
        errorCode: '400',
      });
    }

    const check = await this.libClientProxy
      .send<any>(ACTIONS_MESSAGE_PATTERN.LIBRARY.BOUGHT_BY_USER, {
        name: 'Đã mua',
        type: 'comicId',
        id: media.id,
        user: user,
        golds: media.golds,
        thumbnail: media.thumbnail,
      })
      .toPromise();

    if (check)
      await this.userClientProxy
        .send<any>(USER_MESSAGE_PATTERNS.UPDATE_GOLDS_PAYMENT, {
          userId: user.id,
          golds: user.golds - media.golds,
        })
        .toPromise();
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
