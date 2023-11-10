import { Library } from '@libs/common/entities/actions/library.entity';
import { BaseService } from '@libs/common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LibraryService extends BaseService<Library> {
  constructor(
    @InjectRepository(Library)
    protected readonly repository: Repository<Library>,
  ) {
    super(repository);
  }
}
