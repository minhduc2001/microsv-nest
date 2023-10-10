import { ListPackageDto } from '@libs/common/dtos/payment-system.dto';
import { Package } from '@libs/common/entities/payment-system/package.entity';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PackageService extends BaseService<Package> {
  constructor(
    @InjectRepository(Package)
    protected readonly packageRepository: Repository<Package>,
  ) {
    super(packageRepository);
  }

  async listPackage(query: ListPackageDto) {
    const config: PaginateConfig<Package> = {
      sortableColumns: ['id'],
    };

    return this.listWithPage(query, config);
  }
}
