import { ApiHideProperty } from '@nestjs/swagger';
import { ListDto } from './common.dto';
import { IsOptional } from 'class-validator';
import { User } from '../entities/user/user.entity';

export class ListNotiDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  user: User;
}
