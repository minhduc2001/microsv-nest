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
import { ETypeGenreMedia } from '../enums/media.enum';

export class AuthorIdsDto {
  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @IsArray({})
  @IsPositive({ each: true })
  @ToNumbers()
  authorIds: number[];
}

export class UploadImageAuthorDto {
  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsOptional()
  image: string;
}

export class CreateAuthorDto extends UploadImageAuthorDto {
  @ApiProperty({ example: 'Hàn Mặc Tử' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Nhà văn', required: false })
  @IsOptional()
  @IsString()
  @Trim()
  description: string;

  @ApiProperty({ example: ETypeGenreMedia.Comics })
  @IsEnum(ETypeGenreMedia)
  @ToNumber()
  @IsNotEmpty()
  type: ETypeGenreMedia;
}
