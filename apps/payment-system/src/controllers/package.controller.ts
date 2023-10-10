import { PAYMENT_SYSTEM_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { ListPackageDto } from '@libs/common/dtos/payment-system.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import * as excRpc from '@libs/common/api';
import { PackageService } from '../services/package.service';

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
}
