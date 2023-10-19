import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  desc: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty()
  @ToNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value && Boolean(value))
  isAccess: boolean;

  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @IsArray({})
  @IsPositive({ each: true })
  @ToNumbers()
  genres: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @ToNumber()
  author: number;
}

export class UpdateComicDto extends UploadThumbnailComicDto {
  @ApiProperty({ required: false })
  @IsString()
  @Trim()
  @IsOptional()
  title: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(2)
  @ToNumber()
  minAge: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  desc: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @ToNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value && Boolean(value))
  isAccess: boolean;

  @ApiProperty({ type: Number, isArray: true, required: false })
  @IsOptional()
  @IsArray({})
  @IsPositive({ each: true })
  @ToNumbers()
  genres: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  @ToNumber()
  author: number;
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
  chap: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  comicId: number;

  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsNotEmpty()
  imageUrls: ComicsImageurl[];
}
