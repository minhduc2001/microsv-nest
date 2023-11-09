import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ConvertService } from '../services/convert.service';
import { ApiConsumes } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CreateMovieDto } from '@libs/common/dtos/medias.dto';
import * as exc from '@libs/common/api';
import { UploadService } from '@libs/upload';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTagsAndBearer } from '@libs/common/swagger-ui';
import { Auth } from '../auth/decorators/auth.decorator';

@ApiTagsAndBearer('Movie')
@Controller('movie')
@Auth()
export class MovieController {
  constructor(
    private readonly convertService: ConvertService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'movie', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  @Public()
  async createMovie(
    @Body() payload: CreateMovieDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File; movie?: Express.Multer.File },
  ) {
    console.log(files);

    const movie = files.movie[0].filename;
    const image = files.image[0].filename;

    // await this.convertService.encodeHLSWithMultipleVideoStreams(movie);

    // const url = await this.uploadService.uploadFile(thumbnail.filename, 'img');
    try {
      return 'ok';
    } catch (e) {
      throw new exc.BadException({ message: e.message ?? e });
    }
  }
}
