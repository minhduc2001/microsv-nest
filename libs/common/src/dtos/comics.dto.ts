import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ToNumbers, Trim } from '../decorators/common.decorator';

export class CreateComicDto {
  @ApiProperty()
  @IsString()
  @Trim()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(2)
  minAge: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  desc: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @IsArray({})
  @IsNumber()
  @ToNumbers()
  genres: number[];

  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @IsArray({})
  @IsNumber()
  @ToNumbers()
  authors: number[];
}
