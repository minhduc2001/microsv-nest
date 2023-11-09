import {
  ApiHideProperty,
  ApiProperty,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import { ListDto, UploadImageDto } from './common.dto';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ToNumber, ToNumbers, Trim } from '../decorators/common.decorator';
import { ETypeGenreMedia } from '../enums/media.enum';

export class ListComicsDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  profileId: number;
}

// movie
export class ListMovieDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  profileId: number;
}

export class UploadMovieDto {
  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsOptional()
  movie: string;
}

export class CreateMovieDto extends IntersectionType(
  UploadMovieDto,
  UploadImageDto,
) {
  @ApiProperty({ example: 'Phượng hoàng gãy cánh' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  title: string;

  @ApiProperty({ example: new Date(), required: false })
  @IsDate()
  @IsOptional()
  publishDate: Date;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @Trim()
  @IsOptional()
  desc: string;

  @ApiHideProperty()
  @IsOptional()
  thumbnail?: string;

  @ApiHideProperty()
  @IsOptional()
  url?: string;

  @ApiHideProperty()
  @IsOptional()
  duration?: number;

  @ApiHideProperty()
  @IsOptional()
  isAccess: boolean;

  @ApiHideProperty()
  @IsOptional()
  type: ETypeGenreMedia;

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsPositive({ each: true })
  @IsOptional()
  @ToNumbers()
  authorIds: number[];

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsOptional()
  @IsPositive({ each: true })
  @ToNumbers()
  genreIds: number[];
}

// music
export class ListMusicDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  profileId: number;
}

export class UploadMusicDto {
  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsOptional()
  music: string;
}

export class CreateMusicDto extends IntersectionType(
  UploadMovieDto,
  UploadImageDto,
) {
  @ApiProperty({ example: 'Phượng hoàng gãy cánh' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  title: string;

  @ApiProperty({ example: new Date(), required: false })
  @IsDate()
  @IsOptional()
  publishDate: Date;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @Trim()
  @IsOptional()
  desc: string;

  @ApiHideProperty()
  @IsOptional()
  thumbnail?: string;

  @ApiHideProperty()
  @IsOptional()
  url?: string;

  @ApiHideProperty()
  @IsOptional()
  duration?: number;

  @ApiHideProperty()
  @IsOptional()
  isAccess: boolean;

  @ApiHideProperty()
  @IsOptional()
  type: ETypeGenreMedia;

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsPositive({ each: true })
  @IsOptional()
  @ToNumbers()
  authorIds: number[];

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsOptional()
  @IsPositive({ each: true })
  @ToNumbers()
  genreIds: number[];
}

export class UpdateMusicDto extends PartialType(CreateMusicDto) {
  @ApiHideProperty()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  id: number;
}
