import { PAYMENT_SYSTEM_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import {
  CreatePackageDto,
  ListPackageDto,
  UpdatePackageDto,
  UpdateStatePackageDto,
} from '@libs/common/dtos/payment-system.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import * as excRpc from '@libs/common/api';
import { PackageService } from '../services/package.service';
import { User } from '@libs/common/entities/user/user.entity';

@Controller()
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @MessagePattern(PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.LIST_PACKAGE)
  async listPackage(@Payload() query: ListPackageDto) {
    try {
      return this.packageService.listPackage(query);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.GET_PACKAGE)
  async getOne(@Payload('id') id: number, @Payload('user') user: User) {
    try {
      return this.packageService.getById(id, user);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.CREATE_PACKAGE)
  async create(@Payload() payload: CreatePackageDto) {
    try {
      return this.packageService.createPackage(payload);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.UPDATE_PACKAGE)
  async update(@Payload() payload: UpdatePackageDto) {
    try {
      return this.packageService.updatePackage(payload);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.UPDATE_STATE_PACKAGE)
  async updateState(@Payload() payload: UpdateStatePackageDto) {
    try {
      return this.packageService.updateState(payload);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }

  @MessagePattern(PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.BULK_DELETE_PACKAGE)
  async delete(@Payload('ids') ids: number[]) {
    try {
      return this.packageService.bulkDelete(ids);
    } catch (e) {
      throw new excRpc.BadException({ message: e.message });
    }
  }
}
