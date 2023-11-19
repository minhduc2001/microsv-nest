import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateMovieDto,
  ListMediaDto,
  UpdateMovieDto,
} from '@libs/common/dtos/medias.dto';
import * as exc from '@libs/common/api';
import { UploadService } from '@libs/upload';
import { Public } from '../auth/decorators/public.decorator';
import { ApiCreateOperation, ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { Auth } from '../auth/decorators/auth.decorator';
import { firstValueFrom } from 'rxjs';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { IdsDto, ParamIdDto } from '@libs/common/dtos/common.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthType } from '@libs/common/interfaces/common.interface';

@ApiTagsAndBearer('Movie')
@Controller('movie')
@Auth()
export class MovieController {
  constructor(
    @Inject(RabbitServiceName.MEDIA)
    private readonly mediaClientProxy: ClientProxy,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  async list(@Query() query: ListMediaDto, @GetUser() user: AuthType) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MOVIE.GET_LIST_MOVIE,
          { ...query, user: user },
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
  async findOne(@Param() param: ParamIdDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MOVIE.GET_MOVIE,
          param,
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
  @Public()
  async createMovie(
    @Body() payload: CreateMovieDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    payload.image = await this.uploadService.uploadFile(file.filename, 'movie');

    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MOVIE.CREATE_MOVIE,
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

  @Put()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Public()
  async updateMovie(
    @Body() payload: UpdateMovieDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file)
      payload.image = await this.uploadService.uploadFile(
        file.filename,
        'movie',
      );

    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MOVIE.UPDATE_MOVIE,
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

  @ApiCreateOperation({ summary: 'do not call this api, please!' })
  @Patch(':id/url')
  async updateUrl(
    @Param() param: ParamIdDto,
    @Body() body: { filename: string },
  ) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MOVIE.UPDATE_URL_MOVIE,
          { param, body },
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

  @Delete()
  async bulkDelete(@Body() payload: IdsDto) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MOVIE.BULK_DELETE_MOVIE,
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
