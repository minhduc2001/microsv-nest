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

@ApiTagsAndBearer('Library')
@Controller('library')
@Auth()
export class LibraryController {
  constructor(
    @Inject(RabbitServiceName.ACTIONS) private actionsClientProxy: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Lấy danh sách thư viện' })
  @Get()
  async listLibrary(
    @Query() query: ListLibraryDto,
    @GetUser() profile: Profile,
  ) {}

  @ApiOperation({ summary: 'Lấy danh sách trong thư viện' })
  @Get(':id/list')
  async listAudioBookLibrary(
    @Query() query: ListLibraryChildDto,
    @Param() param: ParamIdDto,
    @GetUser() profile: Profile,
  ) {}

  @ApiOperation({ summary: 'Tạo thư viện' })
  @Post('create-library')
  async createLibrary(
    @Body() dto: CreateLibraryDto,
    @GetUser() profile: Profile,
  ) {}

  @ApiOperation({ summary: 'Lưu ... vào thư viện' })
  @Post('add-library')
  async createAudioBookLibrary(@Body() dto: CreateLibraryChildDto) {}

  @ApiOperation({ summary: 'Sửa thư viện' })
  @Put(':id')
  async updateLibrary(
    @Param() param: ParamIdDto,
    @Body() dto: UpdateLibraryDto,
  ) {}

  @ApiOperation({ summary: 'Xóa thư viện' })
  @Delete(':id')
  async deleteLibrary(
    @Param() param: ParamIdDto,
    @GetUser() profile: Profile,
  ) {}

  @ApiOperation({ summary: 'Xóa nội dung trong thư viện' })
  @Delete(':id/child')
  async deleteAudioBookLibrary(@Param() param: ParamIdDto) {}
}
