import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import { ListDto, UploadImageDto } from './common.dto';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ToNumber, ToNumbers, Trim } from '../decorators/common.decorator';
import { ETypeMedia } from '../enums/media.enum';
import { User } from '../entities/user/user.entity';
import { Profile } from '../entities/user/profile.entity';
import { Transform } from 'class-transformer';
import { EState } from '../enums/common.enum';
import { AuthType } from '../interfaces/common.interface';

export class ListComicsDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  profileId: number;
}

// movie
export class ListMediaDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  user: AuthType;
}

export class CreateMovieDto extends UploadImageDto {
  @ApiProperty({ example: 'Phượng hoàng gãy cánh' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  title: string;

  @ApiProperty({ example: 6 })
  @IsNumber()
  @IsNotEmpty()
  @ToNumber()
  minAge: number;

  @ApiPropertyOptional({ example: new Date(), required: false })
  @Transform(({ value }) => new Date(value))
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
  duration?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @ToNumber()
  @IsOptional()
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

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiHideProperty()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  id: number;
}

// music

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

export class CreateMusicDto extends UploadImageDto {
  @ApiProperty({ example: 'Phượng hoàng gãy cánh' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  title: string;

  @ApiProperty({ example: 6 })
  @IsNumber()
  @IsNotEmpty()
  @ToNumber()
  minAge: number;

  @ApiProperty({ example: new Date(), required: false })
  @Transform(({ value }) => new Date(value))
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
  duration?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @ToNumber()
  @IsOptional()
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

export class UpdateMusicDto extends PartialType(CreateMusicDto) {
  @ApiHideProperty()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  id: number;
}
