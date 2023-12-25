import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isNotEmpty,
} from 'class-validator';
import { ToNumber, Trim } from '../decorators/common.decorator';
import { Transform } from 'class-transformer';

export class UploadAvatarDto {
  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsOptional()
  avatar: string;
}

export class LoginProfileDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @ToNumber()
  id: number;
}

export class CreateProfileDto extends UploadAvatarDto {
  @ApiProperty({ example: 'Bé Bi' })
  @IsNotEmpty()
  @Trim()
  nickname: string;

  @ApiHideProperty()
  @IsOptional()
  @ToNumber()
  @IsNumber()
  id: number;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  birthday: Date;

  @ApiProperty({ example: 3000 })
  @IsNotEmpty()
  @ToNumber()
  @IsNumber()
  onScreen: number;

  @ApiProperty({ example: 3000 })
  @IsNotEmpty()
  @ToNumber()
  @IsNumber()
  order: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value?.toLowerCase()?.trim() === 'true')
  isLocked: boolean;

  @ApiHideProperty()
  @IsNumber()
  @IsOptional()
  @ToNumber()
  userId: number;
}

export class CreateProfileDtoByAdmin extends UploadAvatarDto {
  @ApiProperty({ example: 'Bé Bi' })
  @IsNotEmpty()
  @Trim()
  nickname: string;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  birthday: Date;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value?.toLowerCase()?.trim() === 'true')
  isLocked: boolean;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsNotEmpty()
  @ToNumber()
  userId: number;
}

export class UpdateProfileDto extends UploadAvatarDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Trim()
  nickname: string;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  birthday: Date;

  @ApiProperty({ example: 3000 })
  @IsNotEmpty()
  @ToNumber()
  @IsNumber()
  onScreen: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  progress: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value?.toLowerCase()?.trim() === 'true')
  isLocked: boolean;
}
