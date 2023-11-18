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
import { ETypeAuthor } from '../enums/media.enum';

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

  @ApiProperty({ example: ETypeAuthor.Comics })
  @IsEnum(ETypeAuthor)
  @ToNumber()
  @IsNotEmpty()
  type: ETypeAuthor;
}

export class UpdateAuthorDto extends UploadImageAuthorDto {
  @ApiProperty({ example: 'Hàn Mặc Tử', required: false })
  @Trim()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: 'Nhà văn', required: false })
  @IsOptional()
  @IsString()
  @Trim()
  description: string;

  @ApiProperty({ example: ETypeAuthor.Comics, required: false })
  @IsEnum(ETypeAuthor)
  @ToNumber()
  @IsOptional()
  type: ETypeAuthor;
}
