import { Library } from '@libs/common/entities/actions/library.entity';
import { BaseService } from '@libs/common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as excRpc from '@libs/common/api';
import {
  CreateLibraryDto,
  UpdateLibraryDto,
} from '@libs/common/dtos/library.dto';

@Injectable()
export class LibraryService extends BaseService<Library> {
  constructor(
    @InjectRepository(Library)
    protected readonly repository: Repository<Library>,
  ) {
    super(repository);
  }

  async createLibrary(dto: CreateLibraryDto) {
    const library = await this.repository
      .createQueryBuilder('library')
      .where('unaccent(library.name) ILIKE unaccent(:name)', {
        name: dto.name,
      })
      .andWhere(`library.userId = :userId`, { userId: dto.profile.id })
      .getOne();

    if (library)
      throw new excRpc.BadException({ message: 'Thư viện đã tồn tại' });

    return this.repository.save({
      userId: dto.profile.id,
      name: dto.name,
    });
  }

  async getLibrary(id: number) {
    const library = await this.repository.findOne({ where: { id: id } });
    if (!library)
      throw new excRpc.NotFound({ message: 'Không tồn tại thư viện' });
    return library;
  }

  async deleteLibrary(id: number) {
    return this.repository.delete(id);
  }

  async updateLibrary(dto: UpdateLibraryDto) {
    await this.getLibrary(dto.id);
    await this.repository.update(dto.id, { name: dto.name });
    return true;
  }
}
