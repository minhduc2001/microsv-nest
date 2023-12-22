import { Library } from '@libs/common/entities/actions/library.entity';
import { BaseService } from '@libs/common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as excRpc from '@libs/common/api';
import {
  CreateLibraryDto,
  ListLibraryChildDto,
  ListLibraryDto,
  UpdateLibraryDto,
} from '@libs/common/dtos/library.dto';
import { PaginateConfig } from '@libs/common/services/paginate';
import { AuthType } from '@libs/common/interfaces/common.interface';
import { convertViToEn } from '@libs/common/utils/function';

@Injectable()
export class LibraryService extends BaseService<Library> {
  constructor(
    @InjectRepository(Library)
    protected readonly repository: Repository<Library>,
  ) {
    super(repository);
  }

  async listLib(query: ListLibraryDto) {
    const config: PaginateConfig<Library> = {
      sortableColumns: ['id'],
      where: {
        userId: query.userId,
      },
    };

    return this.listWithPage(query, config);
  }

  async createLibrary(dto: CreateLibraryDto) {
    const library = await this.repository
      .createQueryBuilder('library')
      .where('unaccent(library.name) ILIKE unaccent(:name)', {
        name: dto.name,
      })
      .andWhere(`library.userId = :userId`, { userId: dto.user.id })
      .getOne();

    if (library)
      throw new excRpc.BadException({ message: 'Thư viện đã tồn tại' });

    return this.repository.save({
      userId: dto.user.id,
      name: dto.name,
    });
  }

  async getLibrary(id: number, user: AuthType) {
    const library = await this.repository.findOne({
      where: { id: id, userId: user.id },
    });
    if (!library)
      throw new excRpc.NotFound({ message: 'Không tồn tại thư viện' });
    return library;
  }

  async getLibraryByName(name: string, user: AuthType) {
    const library = await this.repository.findOne({
      where: { name: name, userId: user.id },
    });

    if (!library) {
      const check: string[] = ['Yêu thích', 'Đã mua', 'Danh sách phát'];
      if (check.includes(name)) {
        return this.repository.save({
          name: name,
          userId: user.id,
        });
      }
      throw new excRpc.NotFound({ message: 'Không tồn tại thư viện' });
    }
    return library;
  }

  async deleteLibrary(id: number, user: AuthType) {
    const check: string[] = ['yeu thich', 'da mua', 'danh sach phat'];
    const lib = await this.getLibrary(id, user);
    if (check.includes(convertViToEn(lib.name.toLowerCase()))) {
      throw new excRpc.BadException({
        message: 'Không thể xóa thư viện mặc định',
      });
    }
    return this.repository.delete(id);
  }

  async updateLibrary(dto: UpdateLibraryDto) {
    const check: string[] = ['yeu thich', 'da mua', 'danh sach phat'];
    const lib = await this.getLibrary(dto.id, dto.user);
    if (check.includes(convertViToEn(lib.name.toLowerCase()))) {
      throw new excRpc.BadException({
        message: 'Tên thư viện mặc định không thể đổi',
      });
    }
    await this.repository.update(lib.id, { name: dto.name });
    return true;
  }
}
