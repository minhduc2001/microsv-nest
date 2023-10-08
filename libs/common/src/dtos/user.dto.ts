import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../decorators/common.decorator';

export class LoginDto {
  @ApiProperty({ example: 'parents@doan.com' })
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  email: string;

  @ApiProperty({ example: '123456' })
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
  @IsString()
  @Trim()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @Trim()
  address: string;
}
