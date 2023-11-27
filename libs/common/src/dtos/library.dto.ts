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
import { AuthType } from '../interfaces/common.interface';

export class ListLibraryDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  userId?: number;
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
}

export class CreateLibraryDto {
  @ApiProperty()
  @IsNotEmpty()
  @Trim()
  @IsString()
  name: string;

  @ApiHideProperty()
  @IsOptional()
  user?: AuthType;
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

  @ApiHideProperty()
  @IsOptional()
  user?: AuthType;
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

  @ApiHideProperty()
  @IsOptional()
  user?: AuthType;
}
