import { ListComicsDto } from '@libs/common/dtos/medias.dto';
import { Comics } from '@libs/common/entities/medias/comics.entity';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as excRpc from '@libs/common/api';

@Injectable()
export class ComicsService extends BaseService<Comics> {
  constructor(
    @InjectRepository(Comics) protected comicsRepository: Repository<Comics>,
  ) {
    super(comicsRepository);
  }

  async listComics(query: ListComicsDto) {
    const config: PaginateConfig<Comics> = {
      sortableColumns: ['id'],
    };
    return this.listWithPage(query, config);
  }
}
