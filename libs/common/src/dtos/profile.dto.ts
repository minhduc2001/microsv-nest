import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
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

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value?.toLowerCase?.() === 'true')
  isLocked: boolean;

  @ApiHideProperty()
  @IsNumber()
  @IsOptional()
  userId: number;
}

export class UpdateProfileDto extends UploadAvatarDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Trim()
  nickname: string;

  @ApiProperty({ required: false })
  @IsOptional()
  birthday: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  golds: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  progress: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => value?.toLowerCase?.() === 'true')
  @IsBoolean()
  @IsOptional()
  isLocked: boolean;
}
