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
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ToNumber, ToNumbers, Trim } from '../decorators/common.decorator';
import { ETypeMedia } from '../enums/media.enum';
import { User } from '../entities/user/user.entity';
import { Profile } from '../entities/user/profile.entity';

export class ListComicsDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  profileId: number;
}

// movie
export class ListMovieDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  profile: Profile;
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
  duration?: number;

  @ApiHideProperty()
  @IsOptional()
  isAccess: boolean;

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

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiHideProperty()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  id: number;
}

// music
export class ListMusicDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  profile: Profile;
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

  @ApiHideProperty()
  @IsOptional()
  isAccess: boolean;

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
