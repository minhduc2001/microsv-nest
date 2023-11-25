import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  PickType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ListDto } from './common.dto';
import { Profile } from '../entities/user/profile.entity';
import { ToNumber, Trim } from '../decorators/common.decorator';

export class ListLibraryDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  profileId?: number; // profile
}

export class ListLibraryChildDto extends ListDto {
  @ApiHideProperty()
  @ToNumber()
  @IsOptional()
  @IsPositive()
  libraryId?: number;

  @ApiHideProperty()
  @ToNumber()
  @IsOptional()
  @IsPositive()
  userId?: number;

  @ApiHideProperty()
  @ToNumber()
  @IsOptional()
  @IsPositive()
  cId?: number;
}

export class CreateLibraryDto {
  @ApiProperty()
  @IsNotEmpty()
  @Trim()
  @IsString()
  name: string;

  @ApiHideProperty()
  @IsOptional()
  profile?: Profile;
}

export class CreateLibraryChildDto {
  @ApiProperty()
  @ToNumber()
  @IsNotEmpty()
  @IsPositive()
  libraryId: number;

  @ApiPropertyOptional()
  @ToNumber()
  @IsOptional()
  @IsPositive()
  comicsId: number;

  @ApiPropertyOptional()
  @ToNumber()
  @IsOptional()
  @IsPositive()
  musicId: number;

  @ApiPropertyOptional()
  @ToNumber()
  @IsOptional()
  @IsPositive()
  movieId: number;
}

export class UpdateLibraryDto {
  @ApiProperty()
  @Trim()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiHideProperty()
  @ToNumber()
  @IsOptional()
  @IsPositive()
  id: number;
}
