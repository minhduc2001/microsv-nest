import {
  CreatePackageDto,
  ListPackageDto,
  UpdatePackageDto,
  UpdateStatePackageDto,
} from '@libs/common/dtos/payment-system.dto';
import { Package } from '@libs/common/entities/payment-system/package.entity';
import { User } from '@libs/common/entities/user/user.entity';
import { EState } from '@libs/common/enums/common.enum';
import { ERole } from '@libs/common/enums/role.enum';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Not, Repository } from 'typeorm';
import * as excRpc from '@libs/common/api';

@Injectable()
export class PackageService extends BaseService<Package> {
  constructor(
    @InjectRepository(Package)
    protected readonly packageRepository: Repository<Package>,
    private dataSource: DataSource,
  ) {
    super(packageRepository);
  }

  async listPackage(query: ListPackageDto) {
    const config: PaginateConfig<Package> = {
      sortableColumns: ['id'],
      defaultSortBy: [['updatedAt', 'DESC']],
      searchableColumns: ['name', 'desc'],
      where:
        query.user.role !== ERole.ADMIN
          ? { state: EState.Active }
          : { state: Not(EState.Deleted) },
    };

    return this.listWithPage(query, config);
  }

  async getById(id: number, user: User) {
    const data = await this.repository
      .createQueryBuilder('package')
      .where({ id: id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('package.state = :state', { state: EState.Active });
          if (user.role == ERole.ADMIN) {
            qb.orWhere('package.state = :state', { state: EState.InActive });
          }
        }),
      )
      .getOne();

    if (!data)
      throw new excRpc.BadException({ message: 'Không tồn tại gói này!' });
    return data;
  }

  async createPackage(payload: CreatePackageDto) {
    return this.repository.save({ ...payload });
  }

  async updatePackage(payload: UpdatePackageDto) {
    const pk = await this._getPackage(payload.id);

    const temp = Object.assign(pk, payload);

    if (!payload?.image) temp.image = pk.image;
    return this.repository.update(pk.id, temp);
  }

  async updateState(payload: UpdateStatePackageDto) {
    const pk = await this._getPackage(payload.id);

    pk.state = payload.state;
    return pk.save();
  }

  async bulkDelete(ids: number[]) {
    for (const id of ids) {
      await this.repository.update(id, { state: EState.Deleted });
    }

    return true;
  }

  private async _getPackage(id: number): Promise<Package> {
    const pk = await this.repository.findOne({
      where: { id, state: Not(EState.Deleted) },
    });

    if (!pk)
      throw new excRpc.BadException({ message: 'Không tồn tại gói này!' });
    return pk;
  }
}
