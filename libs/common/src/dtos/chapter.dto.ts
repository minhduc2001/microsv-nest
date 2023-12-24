import { ApiHideProperty } from '@nestjs/swagger';
import { ListDto } from './common.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { ToNumber } from '../decorators/common.decorator';

export class ListChapterDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @ToNumber()
  id: number;
}
