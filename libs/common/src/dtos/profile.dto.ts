import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Trim } from '../decorators/common.decorator';

export class CreateProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @Trim()
  nickname: string;

  @ApiProperty()
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
  @IsNotEmpty()
  @IsNumber()
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
