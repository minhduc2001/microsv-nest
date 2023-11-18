import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { ListDto, UploadImageDto } from './common.dto';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { User } from '../entities/user/user.entity';
import { EState } from '../enums/common.enum';
import { ToNumber, Trim } from '../decorators/common.decorator';
import { EPaymentMethod } from '../enums/payment-system.enum';
import { Transform } from 'class-transformer';

export class ListPackageDto extends ListDto {
  @ApiHideProperty()
  @IsOptional()
  user: User;
}

export class CreatePackageDto extends UploadImageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @ToNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @ToNumber()
  golds: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @ToNumber()
  discount: number;

  @ApiPropertyOptional({
    enum: EState,
  })
  @IsOptional()
  @IsEnum(EState)
  @ToNumber()
  state: EState;

  @ApiPropertyOptional({ example: new Date() })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional({ example: new Date() })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  endDate: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  desc: string;
}

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
  @ApiHideProperty()
  @IsOptional()
  id: number;
}

export class UpdateStatePackageDto extends PickType(UpdatePackageDto, [
  'state',
  'id',
]) {}

// Payment\
export class CreatePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @ToNumber()
  @IsPositive()
  packageId: number;

  @ApiProperty()
  @IsNotEmpty()
  @ToNumber()
  @IsEnum(EPaymentMethod)
  paymentMethod: EPaymentMethod;

  @ApiHideProperty()
  @IsOptional()
  user: User;
}
