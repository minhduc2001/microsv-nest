import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ToNumber, ToNumbers, Trim } from '../decorators/common.decorator';
import { ETypeGenre } from '../enums/media.enum';

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
