import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Profile } from '../entities/user/profile.entity';
import { ToNumber } from '../decorators/common.decorator';
import { ListDto } from './common.dto';

export class ListHistoryDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  profileId: number;
}

export class WriteHistoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  comicsId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  chapterId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  indexChapter?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  musicId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  movieId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @ToNumber()
  @IsPositive()
  duration?: number;

  @ApiProperty({ example: 10000 })
  @IsOptional()
  @ToNumber()
  @IsPositive()
  position?: number;

  @ApiHideProperty()
  @IsOptional()
  profileId: number;
}
