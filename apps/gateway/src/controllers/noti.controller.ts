import { ListNotiDto } from './../../../../libs/common/src/dtos/noti.dto';
import { ApiCreateOperation, ApiTagsAndBearer } from '@libs/common/swagger-ui';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@libs/common/entities/user/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { firstValueFrom } from 'rxjs';
import { ACTIONS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import * as exc from '@libs/common/api';
import { ParamIdDto } from '@libs/common/dtos/common.dto';

@ApiTagsAndBearer('Notification')
@Controller('notification')
@Auth()
export class NotificationController {
  constructor(
    @Inject(RabbitServiceName.ACTIONS)
    private readonly notiClientProxy: ClientProxy,
  ) {}

  @Get()
  @ApiCreateOperation({ summary: 'lay danh sách thông báo' })
  async find(@Query() query: ListNotiDto, @GetUser() user: User) {
    try {
      const resp = await firstValueFrom(
        this.notiClientProxy.send<any>(
          ACTIONS_MESSAGE_PATTERN.NOTI.GET_NOTI_BY_USER,
          { ...query, user: user },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Put(':id')
  @ApiCreateOperation({ summary: 'lay danh sách thông báo' })
  async handleView(@Param() param: ParamIdDto, @GetUser() user: User) {
    try {
      const resp = await firstValueFrom(
        this.notiClientProxy.send<any>(ACTIONS_MESSAGE_PATTERN.NOTI.IS_VIEWS, {
          ...param,
          user: user,
        }),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }
}
