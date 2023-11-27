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
import { AuthType } from '@libs/common/interfaces/common.interface';

@Injectable()
export class LibraryChildService extends BaseService<LibraryChild> {
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
    return await this.repository.save({
      library: library,
    });
  }

  async deleteLibraryChild(id: number, user: AuthType) {
    return this.repository.delete({ id, library: { userId: user.id } });
  }
}
