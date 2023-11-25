import { Comment } from '@libs/common/entities/actions/comment.entity';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService extends BaseService<Comment> {
  constructor(
    @InjectRepository(Comment)
    protected readonly repository: Repository<Comment>,
  ) {
    super(repository);
  }

  async list(query) {
    const config: PaginateConfig<Comment> = {
      sortableColumns: ['id'],
    };

    return this.listWithPage(query, config);
  }
}
