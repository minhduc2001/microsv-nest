import { ETypeMedia } from '@libs/common/enums/media.enum';
import { LibraryChild } from '@libs/common/entities/actions/library-child.entity';
import { BaseService } from '@libs/common/services/base.service';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibraryService } from './library.service';
import {
  AddLibraryChildDto,
  CreateLibraryChildDto,
  ListLibraryChildDto,
} from '@libs/common/dtos/library.dto';
import { PaginateConfig } from '@libs/common/services/paginate';
import { AuthType } from '@libs/common/interfaces/common.interface';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { BadException } from '@libs/common';
import { Profile } from '@libs/common/entities/user/profile.entity';

@Injectable()
export class LibraryChildService extends BaseService<LibraryChild> {
  constructor(
    @Inject(RabbitServiceName.MEDIA)
    private readonly mediaClientProxy: ClientProxy,
    @InjectRepository(LibraryChild)
    protected readonly repository: Repository<LibraryChild>,
    private readonly libraryService: LibraryService,
  ) {
    super(repository);
  }

  async listLibraryChild(query: ListLibraryChildDto) {
    const config: PaginateConfig<LibraryChild> = {
      sortableColumns: ['updatedAt'],
      defaultSortBy: [['updatedAt', 'DESC']],
      where: {
        library: { id: query.libraryId, userId: query.userId },
      },
    };

    return this.listWithPage(query, config);
  }

  async listBoughtLibraryChild(userId: number) {
    const config: PaginateConfig<LibraryChild> = {
      sortableColumns: ['updatedAt'],
      defaultSortBy: [['updatedAt', 'DESC']],
    };

    const query = this.repository
      .createQueryBuilder('clib')
      .leftJoin('clib.library', 'library')
      .where('library.userId = :userId', { userId })
      .andWhere('library.name = :name', { name: 'Đã mua' });

    return this.listWithPage({}, config, query);
  }

  async createLibraryChild(dto: CreateLibraryChildDto) {
    const library = await this.libraryService.getLibrary(
      dto.libraryId,
      dto.user,
    );
    let object;

    if (dto.movieId) {
      object = await this.mediaClientProxy
        .send<any>(MEDIAS_MESSAGE_PATTERN.MOVIE.GET_MOVIE, {
          id: dto.movieId,
        })
        .toPromise();
    } else if (dto.comicsId) {
      object = await this.mediaClientProxy
        .send<any>(MEDIAS_MESSAGE_PATTERN.COMICS.GET_COMICS, {
          id: dto.comicsId,
        })
        .toPromise();
    } else if (dto.movieId) {
      object = await this.mediaClientProxy
        .send<any>(MEDIAS_MESSAGE_PATTERN.MUSIC.GET_MUSIC, { id: dto.musicId })
        .toPromise();
    }

    return await this.repository.save({
      library: library,
      title: object?.title,
      thumbnail: object?.thumbnail,
      ...dto,
    });
  }

  async getClib(id: number, userId: number) {
    const clib = await this.repository
      .createQueryBuilder('clib')
      .leftJoin('clib.library', 'library')
      .where('id = :id', { id })
      .andWhere('library.userId = :userId', { userId })
      .getOne();

    if (!clib) throw new BadException({ message: 'Không có mục này!' });
    return clib;
  }

  async addLibraryChild(dto: AddLibraryChildDto) {
    const clib = await this.getClib(dto.id, dto.user.id);
    const lib = await this.libraryService.getLibraryByName('Đã mua', {
      id: dto.profileId,
    } as Profile);

    return await this.repository.save({ ...clib, library: lib });
  }

  async deleteLibraryChild(id: number, user: AuthType) {
    return this.repository.delete({ id, library: { userId: user.id } });
  }

  async buyCLib() {
    return this.repository;
  }
}
