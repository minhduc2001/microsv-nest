import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ToNumber, ToNumbers, Trim } from '../decorators/common.decorator';
import { ComicsImageurl } from '../interfaces/common.interface';
import { Transform } from 'class-transformer';
import { EState } from '../enums/common.enum';

export class UploadThumbnailComicDto {
  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsOptional()
  @IsString()
  thumbnail: string;
}

export class CreateComicDto extends UploadThumbnailComicDto {
  @ApiProperty()
  @IsString()
  @Trim()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(2)
  @ToNumber()
  minAge: number;

  @ApiPropertyOptional({ example: new Date(), required: false })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  publishDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  desc: string;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsNotEmpty()
  @ToNumber()
  golds: number;

  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsPositive({ each: true })
  @IsOptional()
  @ToNumbers()
  authorIds: number[];

  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsOptional()
  @IsPositive({ each: true })
  @ToNumbers()
  genreIds: number[];

  @ApiPropertyOptional({
    enum: EState,
  })
  @IsOptional()
  @IsEnum(EState)
  @ToNumber()
  state: EState;
}

export class UpdateComicDto extends UploadThumbnailComicDto {
  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  title: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(2)
  @ToNumber()
  minAge: number;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  desc: string;

  @ApiPropertyOptional({ example: new Date(), required: false })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  publishDate: Date;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  @ToNumber()
  golds: number;

  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsPositive({ each: true })
  @IsOptional()
  @ToNumbers()
  authorIds: number[];

  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsOptional()
  @IsPositive({ each: true })
  @ToNumbers()
  genreIds: number[];

  @ApiPropertyOptional({
    enum: EState,
  })
  @IsOptional()
  @IsEnum(EState)
  @ToNumber()
  state: EState;
}

export class CreateChapterDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Trim()
  name: string;

  @ApiProperty({ example: 0 })
  @IsNotEmpty()
  @IsNumber()
  @ToNumber()
  chap: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @ToNumber()
  comicId: number;

  @ApiPropertyOptional({
    enum: EState,
  })
  @IsOptional()
  @IsEnum(EState)
  @ToNumber()
  state: EState;

  @ApiProperty({
    required: false,
    type: 'array',
    // format: 'binary',
    description: 'File to upload',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  images: string[];

  @ApiHideProperty()
  @IsOptional()
  imageUrl: ComicsImageurl[];
}

export class UpdateChapterDto extends PartialType(CreateChapterDto) {}
