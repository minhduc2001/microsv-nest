import { ETypeMedia } from '@libs/common/enums/media.enum';
import { LibraryChild } from '@libs/common/entities/actions/library-child.entity';
import { BaseService } from '@libs/common/services/base.service';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibraryService } from './library.service';
import {
  CreateLibraryChildDto,
  ListLibraryChildDto,
} from '@libs/common/dtos/library.dto';
import { PaginateConfig } from '@libs/common/services/paginate';
import { AuthType } from '@libs/common/interfaces/common.interface';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';

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

  async deleteLibraryChild(id: number, user: AuthType) {
    return this.repository.delete({ id, library: { userId: user.id } });
  }
}
