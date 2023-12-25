import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Trim } from '../decorators/common.decorator';

export class LoginDto {
  @ApiProperty({ example: 'admin@admin.com' })
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  email: string;

  @ApiProperty({ example: '123123' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  password: string;

  @ApiPropertyOptional({ example: '123456' })
  @IsString()
  @IsOptional()
  @Trim()
  token: string;
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
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Trim()
  address?: string;
}

export class IAddUserByAdmin extends RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}

export class UserUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Trim()
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Trim()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  golds: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Trim()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Trim()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  password: string;

  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Trim()
  email: string;
}

export class CheckOTPDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Trim()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otpCode: string;
}
