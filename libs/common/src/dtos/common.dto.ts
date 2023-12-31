import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ToNumber, ToNumbers, Trim } from '../decorators/common.decorator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user/user.entity';

export class PaginationDto {
  @ApiProperty()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  limit?: number;

  @ApiProperty()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  page?: number;
}

export class ParamIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @ToNumber()
  @IsPositive()
  id: number;
}

export class ParamNameDto {
  @ApiProperty()
  @IsNotEmpty()
  @Trim()
  @IsString()
  name: string;
}

export class IdsDto {
  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @IsArray({})
  @IsPositive({ each: true })
  @ToNumbers()
  ids: number[];
}

export class ListDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @ToNumber()
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @ToNumber()
  @IsNumber()
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  sortBy?: [string, string][];

  @ApiProperty({ required: false })
  @IsOptional()
  searchBy?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, type: 'text' })
  @IsOptional()
  filter?: { [column: string]: string | string[] };

  @ApiProperty({ required: false })
  @IsOptional()
  select?: string[];
}

export class UploadImageDto {
  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsOptional()
  image: string;
}

export class UploadImagesDto {
  @ApiProperty({
    required: false,
    type: 'array',
    // format: 'binary',
    description: 'File to upload',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  images: string[];
}

export class BuyMediaDto extends ParamIdDto {
  @ApiHideProperty()
  @IsOptional()
  user: User;
}

export class LikeMediaDto extends ParamIdDto {
  @ApiHideProperty()
  @IsOptional()
  user: User;
}
