import {
  CreateMovieDto,
  CreateMusicDto,
  ListMediaDto,
  UpdateMovieDto,
  UpdateMusicDto,
} from '@libs/common/dtos/medias.dto';
import { Author } from '@libs/common/entities/medias/author.entity';
import { Genre } from '@libs/common/entities/medias/genre.entity';
import { Media } from '@libs/common/entities/medias/media.entity';
import { User } from '@libs/common/entities/user/user.entity';
import {
  ETypeAuthor,
  ETypeGenre,
  ETypeMedia,
} from '@libs/common/enums/media.enum';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Inject, Injectable, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Brackets, LessThan } from 'typeorm';
import * as excRpc from '@libs/common/api';
import {
  IPrepareMediaData,
  IPrepareMediaDataOptions,
} from '@libs/common/interfaces/media.interface';
import { EState, ETypeAccount } from '@libs/common/enums/common.enum';
import { ERole } from '@libs/common/enums/role.enum';
import { detectRole } from '@libs/common/utils/check-auth';
import { Profile } from '@libs/common/entities/user/profile.entity';
import {
  ACTIONS_MESSAGE_PATTERN,
  PAYMENT_SYSTEM_MESSAGE_PATTERN,
} from '@libs/common/constants/rabbit-patterns.constant';

interface Validate {
  genres?: Genre[];
  authors?: Author[];
}

@Injectable()
export class MediaService extends BaseService<Media> {
  constructor(
    @InjectRepository(Media) protected readonly repository: Repository<Media>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @Inject(RabbitServiceName.ACTIONS)
    private readonly libClientProxy: ClientProxy,
  ) {
    super(repository);
  }

  async saveMovie(dto: CreateMovieDto) {
    const { genres, authors } = await this._prepare({
      author_ids: dto.authorIds,
      genre_ids: dto.genreIds,
      type: ETypeMedia.Movies,
    });

    await this._beforeCheck({ authors, genres }, ETypeMedia.Movies);

    const media: Media = this.repository.create(dto);
    media.type = ETypeMedia.Movies;
    media.authors = authors;
    media.genres = genres;

    return media.save();
  }

  async saveMusic(dto: CreateMusicDto) {
    const { genres, authors } = await this._prepare({
      author_ids: dto.authorIds,
      genre_ids: dto.genreIds,
      type: ETypeMedia.Music,
    });

    await this._beforeCheck({ authors, genres }, ETypeMedia.Music);

    const media: Media = this.repository.create(dto);
    media.type = ETypeMedia.Music;
    media.authors = authors;
    media.genres = genres;

    return media.save();
  }

  async updateMovie(id: number, dto: UpdateMovieDto) {
    const media = await this.findOne(id, ETypeMedia.Movies);

    const { authorIds = [], genreIds = [] } = dto;
    const { genres, authors } = await this._prepare({
      author_ids: authorIds,
      genre_ids: genreIds,
      type: ETypeMedia.Movies,
    });

    this._beforeCheck({ authors, genres }, ETypeMedia.Movies);

    media.authors = authors;
    media.genres = genres;
    media.desc = dto.desc;
    media.duration = dto.duration;
    media.minAge = dto.minAge;
    media.golds = dto.golds;
    media.publishDate = dto.publishDate;
    media.thumbnail = dto.thumbnail ?? media.thumbnail;
    media.type = ETypeMedia.Movies;
    media.title = dto.title;
    media.state = dto.state;

    return media.save();
  }

  async updateMusic(id: number, dto: UpdateMusicDto) {
    const media = await this.findOne(id, ETypeMedia.Music);

    const { authorIds = [], genreIds = [] } = dto;
    const { genres, authors } = await this._prepare({
      author_ids: authorIds,
      genre_ids: genreIds,
      type: ETypeMedia.Music,
    });

    this._beforeCheck({ authors, genres }, ETypeMedia.Music);

    media.authors = authors;
    media.genres = genres;
    media.desc = dto.desc;
    media.duration = dto.duration;
    media.minAge = dto.minAge;
    media.golds = dto.golds;
    media.publishDate = dto.publishDate;
    media.thumbnail = dto.thumbnail ?? media.thumbnail;
    media.type = ETypeMedia.Music;
    media.title = dto.title;
    media.state = dto.state;

    return media.save();
  }

  async updateUrl(id: number, url: string, type: ETypeMedia) {
    const media = await this.findOne(id, type);

    media.url = url;
    return media.save();
  }

  async list(query: ListMediaDto, type: ETypeMedia) {
    const config: PaginateConfig<Media> = {
      sortableColumns: ['id', 'updatedAt', 'views'],
      searchableColumns: ['genres.name', 'authors.name', 'title', 'desc'],
      defaultSortBy: [['updatedAt', 'DESC']],
      select: [...this.defautlSelect()],
      relations: ['authors', 'genres'],
    };
    const queryB = this.repository
      .createQueryBuilder('media')
      .where({ type: type })
      .andWhere(
        query.user.role !== ERole.ADMIN
          ? { state: EState.Active }
          : { state: Not(EState.Deleted) },
      )
      .andWhere(
        query.user.role === ERole.CHILDRENS
          ? { minAge: LessThan(this._getAge((query.user as Profile).birthday)) }
          : {},
      );
    return this.listWithPage(query, config, queryB);
  }

  async findOne(id: number, type: ETypeMedia) {
    const media = await this.repository.findOne({
      where: { id, type, state: Not(EState.Deleted) },
      relations: { authors: true, genres: true },
    });

    if (!media)
      throw new excRpc.BadException({
        message: `Không tồn tại ${
          type == ETypeMedia.Music ? 'nhạc' : 'phim'
        } này`,
        errorCode: 'media_not_found',
      });

    return media;
  }

  async buy(mediaId: number, user: User) {
    const media = await this.repository.findOne({ where: { id: mediaId } });
    if (!media)
      throw new excRpc.BadException({
        message: 'Không có sản phẩm này!',
        errorCode: '400',
      });
    if (user.golds < media.golds) {
      throw new excRpc.BadException({
        message: 'Bạn không đủ xu!',
        errorCode: '400',
      });
    }

    await this.libClientProxy
      .send<any>(ACTIONS_MESSAGE_PATTERN.LIBRARY.BOUGHT_BY_USER, {
        name: 'Đã mua',
        media: media,
        user: user,
      })
      .toPromise();

    return true;
  }

  async bulkDelete(ids: number[], type: ETypeMedia) {
    for (const id of ids) {
      await this.repository.update(
        { id: id, type: type },
        { state: EState.Deleted },
      );
    }
    return true;
  }

  private async _beforeCheck(data: Validate, type: ETypeMedia) {
    const { genres, authors } = data;
    if (genres.length) {
      for (const genre of genres) {
        if (
          genre.type === ETypeGenre.Comics ||
          (genre.type as number) !== (type as number)
        )
          throw new excRpc.BadException({
            message: 'Kiểu dữ liệu không đúng!',
          });
      }
    }

    if (authors.length) {
      for (const author of authors) {
        if (
          author.type === ETypeAuthor.Comics ||
          (author.type as number) !== (type as number)
        )
          throw new excRpc.BadException({
            message: 'Kiểu dữ liệu không đúng!',
          });
      }
    }
  }

  private _getAge(birthday: any) {
    const today = new Date();
    const birthDate = new Date(birthday);
    const age =
      (today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    return Math.floor(age);
  }

  private defautlSelect() {
    return [
      'media.id',
      'media.title',
      'media.publishDate',
      'media.views',
      'media.likes',
      'media.desc',
      'media.minAge',
      'media.thumbnail',
      'media.duration',
      'media.isAccess',
      'media.golds',

      'author.id',
      'author.name',
      'author.image',
      'genre.id',
      'genre.name',
    ];
  }

  private async _prepare({
    genre_ids = [],
    author_ids = [],
    type = ETypeMedia.Movies,
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
}
