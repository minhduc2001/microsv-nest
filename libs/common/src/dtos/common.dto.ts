import { IsOptional, IsPositive } from 'class-validator';
import { ToNumber } from '../decorators/common.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  limit?: number;

  @ApiProperty()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  page?: number;
}
