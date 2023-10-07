import {
  CreateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  constructor(partial: Record<string, any>) {
    super();
    Object.assign(this, partial);
    return this;
  }
}
