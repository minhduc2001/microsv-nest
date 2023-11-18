import {
  CreateMovieDto,
  CreateMusicDto,
  ListMovieDto,
  UpdateMovieDto,
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

    console.log(dto);

    this._beforeCheck({ authors, genres }, ETypeMedia.Movies);

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

    this._beforeCheck({ authors, genres }, ETypeMedia.Music);

    const media: Media = this.repository.create(dto);
    media.type = ETypeMedia.Music;
    media.authors = authors;
    media.genres = genres;

    return media.save();
  }

  async updateMovie(id: number, dto: UpdateMovieDto) {
    const media = await this.findOne(id, ETypeMedia.Movies);
  }

  async list(query: ListMovieDto, type: ETypeMedia) {
    const config: PaginateConfig<Media> = {
      sortableColumns: ['id'],
      where:
        query.user.role !== ERole.ADMIN
          ? { state: EState.Active }
          : { state: Not(EState.Deleted) },
    };
    const role = detectRole(query.user);

    const queryB = this.repository
      .createQueryBuilder('media')
      .leftJoinAndSelect('media.authors', 'author')
      .leftJoinAndSelect('media.genres', 'genre')
      .where('media.type = :type', { type });

    if (role === ETypeAccount.Profile)
      queryB.andWhere('media.minAge <= :age', {
        age: this._getAge((query.user as Profile).birthday),
      });

    queryB.select(this.defautlSelect());

    return this.listWithPage(query, config, queryB);
  }

  async findOne(id: number, type: ETypeMedia) {
    const media = await this.repository.findOne({
      where: { id, type, state: Not(EState.Deleted) },
    });

    if (!media)
      throw new excRpc.BadException({
        message: `Không tồn tại ${
          type == ETypeMedia.Music ? 'nhạc' : 'Phim'
        } này`,
      });

    return media;
  }

  async bulkDelete(ids: number[]) {
    for (const id of ids) {
      await this.repository.update(id, { state: EState.Deleted });
    }
    return;
  }

  private _beforeCheck(data: Validate, type: ETypeMedia) {
    const { genres, authors } = data;
    if (genres.length) {
      for (const genre of genres) {
        if (
          (genre.type === ETypeGenre.Movies && type === ETypeMedia.Music) ||
          (genre.type === ETypeGenre.Music && type === ETypeMedia.Movies)
        )
          throw new excRpc.BadException({
            message: 'Kiểu dữ liệu không đúng!',
          });
      }
    }

    if (authors.length) {
      for (const author of authors) {
        if (
          (author.type === ETypeAuthor.Movies && type === ETypeMedia.Music) ||
          (author.type === ETypeAuthor.Music && type === ETypeMedia.Movies)
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
