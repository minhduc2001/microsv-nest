import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ToNumber, ToNumbers, Trim } from '../decorators/common.decorator';
import { ETypeGenre, ETypeMedia } from '../enums/media.enum';
import { ListDto } from './common.dto';
import { AuthType } from '../interfaces/common.interface';

export class ListGenreDto extends ListDto {
  @ApiProperty({ example: ETypeMedia.Movies })
  @IsEnum(ETypeMedia)
  @ToNumber()
  @IsNotEmpty()
  type: ETypeMedia;

  @ApiHideProperty()
  @IsOptional()
  user: AuthType;
}

export class GenreIdsDto {
  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @IsArray({})
  @IsPositive({ each: true })
  @ToNumbers()
  genreIds: number[];
}

export class CreateGenreDto {
  @ApiProperty({ example: 'Vui nhộn' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  name: string;

  @ApiProperty({ example: ETypeGenre.Movies })
  @IsEnum(ETypeGenre)
  @ToNumber()
  @IsNotEmpty()
  type: ETypeGenre;
}

export class UpdateGenreDto {
  @ApiProperty({ example: 'Vui nhộn' })
  @IsString()
  @IsOptional()
  @Trim()
  name: string;

  @ApiProperty({ example: ETypeGenre.Movies })
  @IsEnum(ETypeGenre)
  @ToNumber()
  @IsOptional()
  type: ETypeGenre;
}
