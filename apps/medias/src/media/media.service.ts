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
import { Repository, Not, Brackets } from 'typeorm';
import * as excRpc from '@libs/common/api';
import {
  IPrepareMediaData,
  IPrepareMediaDataOptions,
} from '@libs/common/interfaces/media.interface';
import { EState, ETypeAccount } from '@libs/common/enums/common.enum';
import { ERole } from '@libs/common/enums/role.enum';
import { detectRole } from '@libs/common/utils/check-auth';
import { Profile } from '@libs/common/entities/user/profile.entity';

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
  ) {
    super(repository);
  }

  async saveMovie(dto: CreateMovieDto) {
    const { genres, authors } = await this._prepare({
      author_ids: dto.authorIds,
      genre_ids: dto.genreIds,
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
    });

    this._beforeCheck({ authors, genres }, ETypeMedia.Movies);

    media.authors = authors;
    media.genres = genres;
    media.desc = dto.desc;
    media.duration = dto.duration;
    media.minAge = dto.minAge;
    media.isAccess = dto.isAccess;
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
    });

    this._beforeCheck({ authors, genres }, ETypeMedia.Music);

    media.authors = authors;
    media.genres = genres;
    media.desc = dto.desc;
    media.duration = dto.duration;
    media.minAge = dto.minAge;
    media.isAccess = dto.isAccess;
    media.publishDate = dto.publishDate;
    media.thumbnail = dto.thumbnail ?? media.thumbnail;
    media.type = ETypeMedia.Music;
    media.title = dto.title;
    media.state = dto.state;

    return media.save();
  }

  async list(query: ListMediaDto, type: ETypeMedia) {
    const config: PaginateConfig<Media> = {
      sortableColumns: ['id', 'updatedAt'],
      searchableColumns: ['genres.name', 'authors.name', 'title', 'desc'],
      defaultSortBy: [['updatedAt', 'DESC']],
      where: [
        query.user.role !== ERole.ADMIN
          ? { state: EState.Active }
          : { state: Not(EState.Deleted) },
        query.user.role === ERole.CHILDRENS
          ? { minAge: this._getAge((query.user as Profile).birthday) }
          : {},
      ],
      select: [...this.defautlSelect()],
      relations: ['authors', 'genres'],
    };
    return this.listWithPage(query, config);
  }

  async findOne(id: number, type: ETypeMedia) {
    const media = await this.repository.findOne({
      where: { id, type, state: Not(EState.Deleted) },
    });

    if (!media)
      throw new excRpc.BadException({
        message: `Không tồn tại ${
          type == ETypeMedia.Music ? 'nhạc' : 'phim'
        } này`,
      });

    return media;
  }

  async bulkDelete(ids: number[], type: ETypeMedia) {
    for (const id of ids) {
      await this.repository.update(
        { id: id, type: type },
        { state: EState.Deleted },
      );
    }
    return;
  }

  private async _beforeCheck(data: Validate, type: ETypeMedia) {
    const { genres, authors } = data;
    if (genres.length) {
      for (const genre of genres) {
        console.log(genre.type);

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
    const age = today.getTime() - birthDate.getTime() / (1000 * 60 * 60 * 24);
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
  }: IPrepareMediaDataOptions): Promise<IPrepareMediaData> {
    let genres: Genre[] = [];
    let authors: Author[] = [];

    if (genre_ids?.length) {
      genres = await this.genreRepository
        .createQueryBuilder('genre')
        .where('genre.id IN (:...genre_ids)', { genre_ids })
        .select(['genre.id'])
        .getMany();
    }

    if (author_ids?.length) {
      authors = await this.authorRepository
        .createQueryBuilder('author')
        .where('author.id IN (:...author_ids)', { author_ids })
        .select(['author.id'])
        .getMany();
    }

    return { genres, authors };
  }
}
