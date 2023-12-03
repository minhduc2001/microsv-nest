import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiOperation, ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { ParamIdDto } from '@libs/common/dtos/common.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Profile } from '@libs/common/entities/user/profile.entity';
import { ListHistoryDto, WriteHistoryDto } from '@libs/common/dtos/history.dto';
import * as exc from '@libs/common/api';
import { firstValueFrom } from 'rxjs';
import { ACTIONS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';

@ApiTagsAndBearer('History')
@Controller('history')
@Auth()
export class HistoryController {
  constructor(
    @Inject(RabbitServiceName.ACTIONS) private actionsClientProxy: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'lấy danh sách lịch sử' })
  @Get()
  async listHistory(
    @Query() query: ListHistoryDto,
    @GetUser() profile: Profile,
  ) {
    try {
      const resp = await firstValueFrom(
        this.actionsClientProxy.send<any>(
          ACTIONS_MESSAGE_PATTERN.HISTORY.LIST_HISTORY,
          { ...query, profileId: profile.id },
        ),
      );

      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @ApiOperation({ summary: 'Tạo lịch sử' })
  @Post('')
  async writeEpHistory(
    @Body() dto: WriteHistoryDto,
    @GetUser() profile: Profile,
  ) {
    try {
      const resp = await firstValueFrom(
        this.actionsClientProxy.send<any>(
          ACTIONS_MESSAGE_PATTERN.HISTORY.LOG_HISTORY,
          { ...dto, profileId: profile.id },
        ),
      );

      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }
}
