import { UploadService } from '@libs/upload';
import { PAYMENT_SYSTEM_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import {
  CreatePackageDto,
  ListPackageDto,
  UpdatePackageDto,
  UpdateStatePackageDto,
} from '@libs/common/dtos/payment-system.dto';
import { ApiConsumes, ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as exc from '@libs/common/api';
import { IdsDto, ParamIdDto } from '@libs/common/dtos/common.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@libs/common/entities/user/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/role.decorator';
import { ERole } from '@libs/common/enums/role.enum';

@ApiTagsAndBearer('Package')
@Controller('package')
@Auth()
export class PackageController {
  constructor(
    @Inject(RabbitServiceName.PAYMENT_SYSTEM)
    private readonly paymentSystemClientProxy: ClientProxy,
    private readonly uploadService: UploadService,
  ) {}

  @Get('')
  async listPackage(@Query() query: ListPackageDto, @GetUser() user: User) {
    try {
      const data = await firstValueFrom(
        this.paymentSystemClientProxy.send<any>(
          PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.LIST_PACKAGE,
          { ...query, user: user },
        ),
      );

      return data;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }

  @Get(':id')
  async getOne(@Param() param: ParamIdDto, @GetUser() user: User) {
    try {
      console.log({ ...param, user: user });

      const data = await firstValueFrom(
        this.paymentSystemClientProxy.send<any>(
          PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.GET_PACKAGE,
          { ...param, user: user },
        ),
      );

      return data;
    } catch (e) {
      throw new exc.BadException({ message: e.message });
    }
  }

  @Roles(ERole.ADMIN)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() payload: CreatePackageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = await this.uploadService.uploadFile(file.filename, 'package');
    try {
      const resp = await firstValueFrom(
        this.paymentSystemClientProxy.send<any>(
          PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.CREATE_PACKAGE,
          { ...payload, image: url },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError({ message: e.message ?? e });
    }
  }

  @Roles(ERole.ADMIN)
  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Body() payload: UpdatePackageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let url = '';
    if (file)
      url = await this.uploadService.uploadFile(file.filename, 'package');

    try {
      const resp = await firstValueFrom(
        this.paymentSystemClientProxy.send<any>(
          PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.UPDATE_PACKAGE,
          { ...payload, image: url },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError({
        message: e.message,
        statusCode: e?.status ?? e,
      });
    }
  }

  @Roles(ERole.ADMIN)
  @Put(':id/state')
  async updateState(@Body() payload: UpdateStatePackageDto) {
    try {
      const resp = await firstValueFrom(
        this.paymentSystemClientProxy.send<any>(
          PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.UPDATE_STATE_PACKAGE,
          { state: payload.state },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError({
        message: e.message,
        statusCode: e?.status ?? e,
      });
    }
  }

  @Roles(ERole.ADMIN)
  @Delete('')
  async delete(@Body() payload: IdsDto) {
    try {
      const resp = await firstValueFrom(
        this.paymentSystemClientProxy.send<any>(
          PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.BULK_DELETE_PACKAGE,
          payload,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError({
        message: e.message,
        statusCode: e?.status ?? e,
      });
    }
  }
}
