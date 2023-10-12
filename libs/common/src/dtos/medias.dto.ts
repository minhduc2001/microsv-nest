import { ApiHideProperty } from '@nestjs/swagger';
import { ListDto } from './common.dto';
import { IsOptional } from 'class-validator';

export class ListComicsDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  profileId: number;
}
