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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiOperation, ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { ParamIdDto } from '@libs/common/dtos/common.dto';
import {
  CreateLibraryChildDto,
  CreateLibraryDto,
  ListLibraryChildDto,
  ListLibraryDto,
  UpdateLibraryDto,
} from '@libs/common/dtos/library.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Profile } from '@libs/common/entities/user/profile.entity';
import { ETypeAccount } from '@libs/common/enums/common.enum';
import { firstValueFrom } from 'rxjs';
import { ACTIONS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { AuthType } from '@libs/common/interfaces/common.interface';
import * as exc from '@libs/common/api';

@ApiTagsAndBearer('Library')
@Controller('library')
@Auth()
export class LibraryController {
  constructor(
    @Inject(RabbitServiceName.ACTIONS) private actionsClientProxy: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Lấy danh sách thư viện' })
  @Get()
  async listLibrary(@Query() query: ListLibraryDto, @GetUser() user: AuthType) {
    try {
      const resp = await firstValueFrom(
        this.actionsClientProxy.send<any>(
          ACTIONS_MESSAGE_PATTERN.LIBRARY.LIST_LIBRARY_BY_USER,
          { ...query, userId: user.id },
        ),
      );

      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @ApiOperation({ summary: 'Lấy danh sách trong thư viện' })
  @Get(':id/list')
  async listAudioBookLibrary(
    @Query() query: ListLibraryChildDto,
    @Param() param: ParamIdDto,
    @GetUser() user: AuthType,
  ) {
    try {
      const resp = await firstValueFrom(
        this.actionsClientProxy.send<any>(
          ACTIONS_MESSAGE_PATTERN.LIBRARY.LIST_LIBRARY_CHILD_BY_USER,
          { ...query, userId: user.id, libraryId: param.id },
        ),
      );

      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @ApiOperation({ summary: 'Tạo thư viện' })
  @Post('create-library')
  async createLibrary(
    @Body() dto: CreateLibraryDto,
    @GetUser() user: AuthType,
  ) {
    try {
      const resp = await firstValueFrom(
        this.actionsClientProxy.send<any>(
          ACTIONS_MESSAGE_PATTERN.LIBRARY.CREATE_LIBRARY,
          { ...dto, user: user },
        ),
      );

      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @ApiOperation({ summary: 'Lưu ... vào thư viện' })
  @Post('add-library')
  async createAudioBookLibrary(
    @Body() dto: CreateLibraryChildDto,
    @GetUser() user: AuthType,
  ) {
    try {
      const resp = await firstValueFrom(
        this.actionsClientProxy.send<any>(
          ACTIONS_MESSAGE_PATTERN.LIBRARY.ADD_LIBRARY,
          { ...dto, user: user },
        ),
      );

      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @ApiOperation({ summary: 'Sửa thư viện' })
  @Put(':id')
  async updateLibrary(
    @Param() param: ParamIdDto,
    @Body() dto: UpdateLibraryDto,
    @GetUser() user: ETypeAccount,
  ) {
    try {
      const resp = await firstValueFrom(
        this.actionsClientProxy.send<any>(
          ACTIONS_MESSAGE_PATTERN.LIBRARY.UPDATE_LIBRARY,
          { ...dto, ...param, user: user },
        ),
      );

      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @ApiOperation({ summary: 'Xóa thư viện' })
  @Delete(':id')
  async deleteLibrary(
    @Param() param: ParamIdDto,
    @GetUser() user: ETypeAccount,
  ) {
    try {
      const resp = await firstValueFrom(
        this.actionsClientProxy.send<any>(
          ACTIONS_MESSAGE_PATTERN.LIBRARY.DELETE_LIB,
          { ...param, user: user },
        ),
      );

      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @ApiOperation({ summary: 'Xóa nội dung trong thư viện' })
  @Delete(':id/child')
  async deleteAudioBookLibrary(
    @Param() param: ParamIdDto,
    @GetUser() user: ETypeAccount,
  ) {
    try {
      const resp = await firstValueFrom(
        this.actionsClientProxy.send<any>(
          ACTIONS_MESSAGE_PATTERN.LIBRARY.DELETE_C_LIB,
          { ...param, user: user },
        ),
      );

      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }
}
