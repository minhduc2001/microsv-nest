import * as exc from '@libs/common/api';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateComicDto } from '@libs/common/dtos/comics.dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';
import { query } from 'express';
import { ListDto, ParamIdDto } from '@libs/common/dtos/common.dto';
import { CreateAuthorDto } from '@libs/common/dtos/author.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '@libs/upload';

@Controller('author')
@ApiTagsAndBearer('Author')
@Auth()
export class AuthorController {
  constructor(
    @Inject(RabbitServiceName.MEDIA) private mediaClientProxy: ClientProxy,
    private uploadService: UploadService,
  ) {}

  @Get()
  async getListAuthor(@Query() query: ListDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.AUTHOR.GET_LIST_AUTHOR,
          query,
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

  @Get(':id')
  async getAuthor(@Param() param: ParamIdDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.AUTHOR.GET_AUTHOR,
          param.id,
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

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async createAuthor(
    @Body() payload: CreateAuthorDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      const imageUrl = await this.uploadService.uploadFile(image.filename);
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.AUTHOR.CREATE_AUTHOR,
          { ...payload, image: imageUrl },
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

  @Patch(':id')
  async updateAuthor() {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.AUTHOR.UPDATE_AUTHOR,
          null,
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
