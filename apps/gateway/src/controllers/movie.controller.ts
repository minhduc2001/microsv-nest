import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Ip,
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
import {
  BuyMediaDto,
  IdsDto,
  LikeMediaDto,
  ParamIdDto,
} from '@libs/common/dtos/common.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthType } from '@libs/common/interfaces/common.interface';
import { ERole } from '@libs/common/enums/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { User } from '@libs/common/entities/user/user.entity';

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
  @ApiCreateOperation({ summary: 'Lấy danh sách phim' })
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
      throw new exc.CustomError(e);
    }
  }

  @Get(':id')
  @ApiCreateOperation({ summary: 'Lấy chi tiết phim' })
  async findOne(@Param() param: ParamIdDto, @GetUser() user: AuthType) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MOVIE.GET_MOVIE,
          { ...param, user: user },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiCreateOperation({ summary: 'Thêm mới 1 phim' })
  async createMovie(
    @Body() payload: CreateMovieDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    payload.thumbnail = await this.uploadService.uploadFile(
      file.filename,
      'movie',
    );

    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MOVIE.CREATE_MOVIE,
          payload,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Post('buy')
  @Roles(ERole.PARENTS)
  @ApiCreateOperation({ summary: 'mua phim' })
  async buy(@Body() payload: BuyMediaDto, @GetUser() user: User) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(MEDIAS_MESSAGE_PATTERN.MOVIE.BUY, {
          ...payload,
          user: user,
        }),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Post('like')
  @ApiCreateOperation({ summary: 'like' })
  async like(@Body() payload: LikeMediaDto, @GetUser() user: User) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(MEDIAS_MESSAGE_PATTERN.MOVIE.LIKE, {
          ...payload,
          user: user,
        }),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiCreateOperation({ summary: 'Cập nhật 1 phim' })
  async updateMovie(
    @Param() param: ParamIdDto,
    @Body() payload: UpdateMovieDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file)
      payload.thumbnail = await this.uploadService.uploadFile(
        file.filename,
        'movie',
      );

    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MOVIE.UPDATE_MOVIE,
          { ...payload, ...param },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @ApiCreateOperation({
    summary: 'Cập nhật url nhạc. chỉ chấp nhận request do server2 gửi lên',
  })
  @Patch(':id/url')
  async updateUrl(
    @Param() param: ParamIdDto,
    @Body() body: { filename: string },
    @Headers() headers: any,
  ) {
    try {
      const resp = await firstValueFrom(
        this.mediaClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.MOVIE.UPDATE_URL_MOVIE,
          { ...param, ...body },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Delete()
  @ApiCreateOperation({ summary: 'Xóa nhiều truyện' })
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
      throw new exc.CustomError(e);
    }
  }
}
