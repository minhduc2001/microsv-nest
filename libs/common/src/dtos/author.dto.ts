import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsPositive } from 'class-validator';
import { ToNumbers } from '../decorators/common.decorator';

export class AuthorIdsDto {
  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @IsArray({})
  @IsPositive({ each: true })
  @ToNumbers()
  authorIds: number[];
}
