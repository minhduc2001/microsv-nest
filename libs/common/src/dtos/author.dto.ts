import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ToNumbers, Trim } from '../decorators/common.decorator';

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
}
