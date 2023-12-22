import {
  BuyMediaDto,
  ParamIdDto,
  UploadImagesDto,
} from '@libs/common/dtos/common.dto';
import { ListComicsDto } from '@libs/common/dtos/medias.dto';
import {
  ApiConsumes,
  ApiCreateOperation,
  ApiTagsAndBearer,
} from '@libs/common/swagger-ui';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
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
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as exc from '@libs/common/api';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { MEDIAS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateComicDto, UpdateComicDto } from '@libs/common/dtos/comics.dto';
import { UploadService } from '@libs/upload';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthType } from '@libs/common/interfaces/common.interface';
import { ERole } from '@libs/common/enums/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { User } from '@libs/common/entities/user/user.entity';

@Controller('comics')
@ApiTagsAndBearer('Comics')
@Auth()
export class ComicsController {
  constructor(
    @Inject(RabbitServiceName.MEDIA)
    private readonly comicsClientProxy: ClientProxy,
    private readonly uploadService: UploadService,
  ) {}

  // @Post()
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FilesInterceptor('images', 10))
  // async uploadImages(
  //   @Body() dto: UploadImagesDto,
  //   @UploadedFiles() images: Array<Express.Multer.File>,
  // ) {}

  @Get()
  @ApiCreateOperation({ summary: 'Lấy danh sách truyện' })
  async getListCommic(
    @Query() query: ListComicsDto,
    @GetUser() user: AuthType,
  ) {
    try {
      const resp = await lastValueFrom(
        this.comicsClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.COMICS.LIST_COMICS,
          { ...query, user: user },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Get(':id')
  @ApiCreateOperation({ summary: 'Lấy chi tiết 1 truyện' })
  async getComic(@Param() param: ParamIdDto) {
    try {
      const resp = await lastValueFrom(
        this.comicsClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.COMICS.GET_COMICS,
          param.id,
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiCreateOperation({ summary: 'Tạo 1 truyện mới' })
  async createComic(
    @Body() payload: CreateComicDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    const url = await this.uploadService.uploadFile(thumbnail.filename, 'img');
    try {
      const resp = await lastValueFrom(
        this.comicsClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.COMICS.CREATE_COMIC,
          { ...payload, thumbnail: url },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Post('buy')
  @Roles(ERole.PARENTS)
  @ApiCreateOperation({ summary: 'mua truyen' })
  async buy(@Body() payload: BuyMediaDto, @GetUser() user: User) {
    try {
      const resp = await firstValueFrom(
        this.comicsClientProxy.send<any>(MEDIAS_MESSAGE_PATTERN.COMICS.BUY, {
          ...payload,
          user: user,
        }),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiCreateOperation({ summary: 'Cập nhật truyện' })
  async updateComic(
    @UploadedFile() thumbnail: Express.Multer.File,
    @Param() params: ParamIdDto,
    @Body() payload: UpdateComicDto,
  ) {
    const url = thumbnail
      ? await this.uploadService.uploadFile(thumbnail.filename, 'img')
      : undefined;
    try {
      const resp = await lastValueFrom(
        this.comicsClientProxy.send<any>(
          MEDIAS_MESSAGE_PATTERN.COMICS.UPDATE_COMIC,
          { id: params.id, body: { ...payload, thumbnail: url } },
        ),
      );
      return resp;
    } catch (e) {
      throw new exc.CustomError(e);
    }
  }
}
