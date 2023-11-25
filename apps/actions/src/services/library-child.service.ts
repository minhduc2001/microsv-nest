import { ETypeMedia } from '@libs/common/enums/media.enum';
import { LibraryChild } from '@libs/common/entities/actions/library-child.entity';
import { BaseService } from '@libs/common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibraryService } from './library.service';
import {
  CreateLibraryChildDto,
  ListLibraryChildDto,
} from '@libs/common/dtos/library.dto';
import { PaginateConfig } from '@libs/common/services/paginate';

@Injectable()
export class AudioBookLibraryService extends BaseService<LibraryChild> {
  constructor(
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
        id: query.cId,
        library: { id: query.libraryId, userId: query.userId },
      },
    };

    return this.listWithPage(query, config);
  }

  async createLibraryChild(dto: CreateLibraryChildDto, type: ETypeMedia) {
    const library = await this.libraryService.getLibrary(dto.libraryId);
    const cLibs = this.repository.create({
      library: library,
    });

    switch (type) {
      case ETypeMedia.Movies:
        cLibs.movieId = dto.movieId;
        break;
      case ETypeMedia.Music:
        cLibs.musicId = dto.musicId;
        break;
      case ETypeMedia.Comics:
        cLibs.comicsId = dto.comicsId;
        break;
    }

    return await cLibs.save();
  }

  async deleteLibraryChild(id: number) {
    return this.repository.delete(id);
  }
}
