import { Genre } from '@libs/common/entities/medias/genre.entity';
import { BaseService } from '@libs/common/services/base.service';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
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
import { AuthType } from '@libs/common/interfaces/common.interface';
import { ACTIONS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';
import { Media } from '@libs/common/entities/medias/media.entity';
import { Comics } from '@libs/common/entities/medias/comics.entity';
import { ERole } from '@libs/common/enums/role.enum';
import { Profile } from '@libs/common/entities/user/profile.entity';

@Injectable()
export class GenreService extends BaseService<Genre> {
  constructor(
    @InjectRepository(Genre) protected repository: Repository<Genre>,
    @Inject(RabbitServiceName.ACTIONS)
    private readonly libClientProxy: ClientProxy,
  ) {
    super(repository);
  }

  async prepareResponse(genres: Genre[], user: AuthType, type: ETypeMedia) {
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
      if (type === ETypeMedia.Movies) {
        return lib.movieId;
      }
      if (type === ETypeMedia.Music) {
        return lib.musicId;
      }
      if (type === ETypeMedia.Comics) {
        return lib.comicsId;
      }
    });

    const idLike = libLike.results.map((lib) => {
      if (type === ETypeMedia.Movies) {
        return lib.movieId;
      }
      if (type === ETypeMedia.Music) {
        return lib.musicId;
      }
      if (type === ETypeMedia.Comics) {
        return lib.comicsId;
      }
    });

    const idPlaylist: number[] = libPlaylist.results.map((lib) => {
      if (type === ETypeMedia.Movies) {
        return lib.movieId;
      }
      if (type === ETypeMedia.Music) {
        return lib.musicId;
      }
      if (type === ETypeMedia.Comics) {
        return lib.comicsId;
      }
    });

    if (type === ETypeMedia.Comics) {
      for (const genre of genres) {
        for (const comic of genre.comics) {
          if (idBuys.includes(comic.id)) comic.isAccess = true;
          if (idLike.includes(comic.id)) comic.isLike = true;
          if (idPlaylist.includes(comic.id)) comic.isPlaylist = true;
        }
      }
    } else
      for (const genre of genres) {
        for (const media of genre.medias) {
          if (idBuys.includes(media.id)) media.isAccess = true;
          if (idLike.includes(media.id)) media.isLike = true;
          if (idPlaylist.includes(media.id)) media.isPlaylist = true;
        }
      }
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
      .andWhere(
        query.user.role === ERole.CHILDRENS
          ? { minAge: LessThan(this._getAge((query.user as Profile).birthday)) }
          : {},
      );
    // .andWhere('genre.type', { type: query.type as number });

    if (query.type == ETypeMedia.Comics) {
      queryB
        .leftJoinAndSelect('genre.comics', 'comics')
        .where('comics.state = :state', { state: EState.Active });
    } else {
      queryB
        .leftJoinAndSelect('genre.medias', 'media')
        .where('media.state = :state', { state: EState.Active });
    }
    const results = await this.listWithPage(query, config, queryB);

    await this.prepareResponse(results.results, query.user, query.type);
    return results;
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

  private _getAge(birthday: any) {
    const today = new Date();
    const birthDate = new Date(birthday);
    const age =
      (today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    return Math.floor(age);
  }
}
