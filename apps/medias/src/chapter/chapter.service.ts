import * as excRpc from '@libs/common/api';
import { CreateChapterDto } from '@libs/common/dtos/comics.dto';
import { ListDto } from '@libs/common/dtos/common.dto';
import { Chapter } from '@libs/common/entities/medias/chapter.entity';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComicsService } from '../comics/comics.service';

@Injectable()
export class ChapterService extends BaseService<Chapter> {
  constructor(
    @InjectRepository(Chapter) protected repository: Repository<Chapter>,
    private readonly comicsService: ComicsService,
  ) {
    super(repository);
  }

  async getListChapter(query: ListDto) {
    const config: PaginateConfig<Chapter> = {
      sortableColumns: ['id'],
    };
    return await this.listWithPage(query, config);
  }

  async getChapterById(id: number) {
    const chapter = await this.repository.findOne({ where: { id } });
    if (!chapter)
      return new excRpc.BadRequest({ message: 'Chapter does not exists' });
    return chapter;
  }

  async createChapter(dto: CreateChapterDto) {
    const comic = await this.comicsService.getComic(dto.comicId);
    const exists = await this.repository.findOne({
      where: { chap: dto.chap, comics: { id: dto.comicId } },
    });
    if (exists)
      return new excRpc.BadRequest({ message: 'Chapter has already exist!' });

    const chapter = Object.assign(new Chapter(), { ...dto });
    chapter.comics = comic;
    this.repository.save({ ...chapter });

    return 'Create Chapter successful';
  }
}
