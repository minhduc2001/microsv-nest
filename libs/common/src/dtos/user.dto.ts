import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { Trim } from '../decorators/common.decorator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  password: string;
}

export class RegisterDto extends PickType(LoginDto, ['email', 'password']) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  @Trim()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  @Trim()
  address: string;
}
