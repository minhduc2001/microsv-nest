import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Trim } from '../decorators/common.decorator';

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

export class CreateProfileDto extends UploadAvatarDto {
  @ApiProperty({ example: 'Bé Bi' })
  @IsNotEmpty()
  @Trim()
  nickname: string;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  birthday: Date;

  @ApiHideProperty()
  @IsNumber()
  @IsOptional()
  userId: number;
}

export class UpdateProfileDto extends UploadAvatarDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  nickname: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  golds: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  progress: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isLocked: boolean;
}
