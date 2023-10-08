import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Trim } from '../decorators/common.decorator';

export class CreateProfileDto {
  @ApiProperty({ example: 'Bé Bi' })
  @IsNotEmpty()
  @Trim()
  nickname: string;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsOptional()
  @Trim()
  avatar: string;

  @ApiHideProperty()
  @IsNumber()
  @IsOptional()
  userId: number;
}

export class UpdateProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  nickname: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsOptional()
  @Trim()
  avatar: string;

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
