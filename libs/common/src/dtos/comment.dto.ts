import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ListDto } from './common.dto';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Trim } from '../decorators/common.decorator';
import { Profile } from '../entities/user/profile.entity';

export class ListCommentDto extends ListDto {}

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsIn([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5])
  stars: number;

  @ApiHideProperty()
  @IsOptional()
  profile: Profile;
}
