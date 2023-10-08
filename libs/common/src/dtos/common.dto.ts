import { IsArray, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { ToNumber, ToNumbers } from '../decorators/common.decorator';
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

export class ParamIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @ToNumber()
  @IsPositive()
  id: number;
}

export class IdsDto {
  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @IsArray({})
  @IsPositive({ each: true })
  @ToNumbers()
  ids: number[];
}
