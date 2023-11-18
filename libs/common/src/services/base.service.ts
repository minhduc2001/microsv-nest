import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { paginate, PaginateConfig, PaginateQuery } from './paginate';

export abstract class BaseService<T> {
  protected constructor(protected readonly repository: Repository<T>) {}

  protected async listWithPage(
    query: PaginateQuery,
    config: PaginateConfig<T>,
    customQuery?: Repository<T> | SelectQueryBuilder<T>,
  ) {
    if (customQuery) {
      return paginate<T>(query, customQuery, config);
    }
    return paginate<T>(query, this.repository, config);
  }

  protected async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  protected async findAndCount(
    options?: FindManyOptions<T>,
  ): Promise<[T[], number]> {
    return await this.repository.findAndCount(options);
  }

  protected async getOne(options?: FindOneOptions<T>): Promise<T> {
    return await this.repository.findOne(options);
  }

  protected async create(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  protected async update(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  protected async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  protected async softDelete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }
}
