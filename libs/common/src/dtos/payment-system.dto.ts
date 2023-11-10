import {
  ApiHideProperty,
  ApiProperty,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { ListDto, UploadImageDto } from './common.dto';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { User } from '../entities/user/user.entity';
import { EState } from '../enums/common.enum';
import { ToNumber, Trim } from '../decorators/common.decorator';
import { EPaymentMethod } from '../enums/payment-system.enum';

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

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  @ToNumber()
  discount: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(EState)
  @ToNumber()
  state: EState;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  endDate: Date;

  @ApiProperty()
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
