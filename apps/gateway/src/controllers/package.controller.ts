import { PAYMENT_SYSTEM_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { ListPackageDto } from '@libs/common/dtos/payment-system.dto';
import { ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as exc from '@libs/common/api';

@ApiTagsAndBearer('Package')
@Controller('package')
export class PackageController {
  constructor(
    @Inject(RabbitServiceName.PAYMENT_SYSTEM)
    private readonly paymentSystemClientProxy: ClientProxy,
  ) {}

  @Get('')
  async listPackage(@Query() query: ListPackageDto) {
    try {
      const data = await firstValueFrom(
        this.paymentSystemClientProxy.send<any>(
          PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.LIST_PACKAGE,
          query,
        ),
      );
      console.log(data);

      return data;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }
}
