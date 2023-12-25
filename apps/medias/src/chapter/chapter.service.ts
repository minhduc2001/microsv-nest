import * as excRpc from '@libs/common/api';
import {
  CreateChapterDto,
  UpdateChapterDto,
  UpdateComicDto,
} from '@libs/common/dtos/comics.dto';
import { ListDto } from '@libs/common/dtos/common.dto';
import { Chapter } from '@libs/common/entities/medias/chapter.entity';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ComicsService } from '../comics/comics.service';
import { ListChapterDto } from '@libs/common/dtos/chapter.dto';
import { EState } from '@libs/common/enums/common.enum';
import { ERole } from '@libs/common/enums/role.enum';

@Injectable()
export class ChapterService extends BaseService<Chapter> {
  constructor(
    @InjectRepository(Chapter) protected repository: Repository<Chapter>,
    private readonly comicsService: ComicsService,
  ) {
    super(repository);
  }

  async getListChapter(query: ListChapterDto) {
    const config: PaginateConfig<Chapter> = {
      sortableColumns: ['id'],
      where: {
        comics: { id: query.id },
        state:
          query.user.role === ERole.ADMIN ? Not(EState.Deleted) : EState.Active,
      },
    };
    return await this.listWithPage(query, config);
  }

  async getChapterById(id: number) {
    const chapter = await this.repository.findOne({ where: { id } });
    if (!chapter)
      throw new excRpc.BadRequest({ message: 'Chapter does not exists' });
    return chapter;
  }

  async createChapter(dto: CreateChapterDto) {
    const comic = await this.comicsService.getComicById(dto.comicId);
    const exists = await this.repository.findOne({
      where: { chap: dto.chap, comics: { id: dto.comicId } },
    });
    if (exists)
      throw new excRpc.BadRequest({ message: 'Chapter has already exist!' });

    if (dto.images) delete dto.images;

    const chapter = Object.assign(new Chapter(), { ...dto });
    chapter.comics = comic;
    await this.repository.save({ ...chapter });

    return 'Create Chapter successful';
  }

  // async updateChapter(dto: UpdateChapterDto) {
  //   const comic = await this.comicsService.getComicById(dto.comicId);
  //   const exists = await this.repository.findOne({
  //     where: { chap: dto.chap, comics: { id: dto.comicId } },
  //   });
  //   if (!exists)
  //     throw new excRpc.BadRequest({ message: 'Chapter không tồn tại!' });

  //   if (dto.images) delete dto.images;

  //   return this.repository
  // }

  async bulkDelete(ids: number[]) {
    for (const id of ids) {
      await this.repository.update({ id: id }, { state: EState.Deleted });
    }
    return true;
  }
}
