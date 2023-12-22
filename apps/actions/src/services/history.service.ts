import { ClientProxy } from '@nestjs/microservices';
import { ListHistoryDto, WriteHistoryDto } from '@libs/common/dtos/history.dto';
import { History } from '@libs/common/entities/actions/history.entity';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';

@Injectable()
export class HistoryService extends BaseService<History> {
  constructor(
    @InjectRepository(History)
    protected readonly repository: Repository<History>,
    @Inject(RabbitServiceName.MEDIA)
    private readonly mediaClientProxy: ClientProxy,
  ) {
    super(repository);
  }

  async listHistory(query: ListHistoryDto) {
    const config: PaginateConfig<History> = {
      sortableColumns: ['updatedAt'],
      where: { userId: query.profileId },
    };
    return this.listWithPage(query, config);
  }

  async writeHistory(dto: WriteHistoryDto) {
    let history;
    let object;
    let chapter;

    if (dto.movieId) {
      history = await this.repository.findOne({
        where: {
          userId: dto.profileId,
          movieId: dto.movieId,
        },
      });
      if (history) {
        history.position = dto.position;
        return history.save();
      }
      object = await this.mediaClientProxy
        .send<any>(MEDIAS_MESSAGE_PATTERN.MOVIE.GET_MOVIE, {
          id: dto.movieId,
        })
        .toPromise();
    } else if (dto.comicsId) {
      history = await this.repository.findOne({
        where: {
          userId: dto.profileId,
          comicsId: dto.comicsId,
          chapterId: dto.chapterId,
        },
      });
      if (history) {
        history.indexChapter = dto.indexChapter;
        return history.save();
      }
      object = await this.mediaClientProxy
        .send<any>(MEDIAS_MESSAGE_PATTERN.COMICS.GET_COMICS, {
          id: dto.comicsId,
        })
        .toPromise();

      chapter = await this.mediaClientProxy
        .send<any>(MEDIAS_MESSAGE_PATTERN.CHAPTER.GET_CHAPTER, {
          id: dto.chapterId,
        })
        .toPromise();
    } else if (dto.movieId) {
      history = await this.repository.findOne({
        where: {
          userId: dto.profileId,
          movieId: dto.movieId,
        },
      });

      if (history) {
        history.position = dto.position;
        return history.save();
      }

      object = await this.mediaClientProxy
        .send<any>(MEDIAS_MESSAGE_PATTERN.MUSIC.GET_MUSIC, { id: dto.musicId })
        .toPromise();
    }

    return this.repository.save({
      ...dto,
      chap: chapter?.chap,
      name: chapter?.name,
      title: object?.title,
      thumbnail: object?.thumbnail,
      userId: dto.profileId,
    });
  }
}
