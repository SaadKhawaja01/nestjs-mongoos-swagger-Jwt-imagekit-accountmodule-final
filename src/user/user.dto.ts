import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class ISignupDto {
  @ApiProperty({ default: 'kawajasaadmasood@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ICompleteSignupDto {
  @ApiProperty({ default: 'kawajasaadmasood@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  otp: string;
}

export interface ICreateUserDto {
  name?: string;
  email: string;
  legalName?: string;
  persona?: string;
  secondaryEmail?: string;
  emailVerifiedAt?: Date;
  phone?: string;
  secondaryPhone?: string;
  passwordHash?: string;
  role?: string;
  otpHash?: string;
}

export interface IJwtPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface IUserResponse {
  avatar: string;
  name: string;
  legalName: string;
  email: string;
  phone: string;
  role: string;
  emailVerified: boolean;
  passwordSetup: boolean;
}

export class ICreateRegistrationDto {
  @ApiProperty({ default: 'kawajasaadmasood@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  otpHash: string;
}
export class ISetupAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ default: 'Saad Khawaja' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: '0300677484' })
  @IsNotEmpty()
  phone: string;
}

export class ISignInDto {
  @ApiProperty({ default: 'khawajasaadmasood@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class IForgotPasswordDto {
  @ApiProperty({ default: 'khawajasaadmasood@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class IValidateResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  otp: string;
  @ApiProperty({ default: 'khawajasaadmasood@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class IResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
export class IUpdateBioDto {
  @ApiProperty({ default: 'Saad Khawaja' })
  @IsOptional()
  legalName!: string;

  @ApiProperty({ default: 'Saad' })
  @IsOptional()
  name: string;
}
export class IChangePasswordDto {
  @ApiProperty({ default: 'password' })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ default: 'password123' })
  @IsNotEmpty()
  newPassword: string;
}

export class IChangePhoneDto {
  @ApiProperty({ default: '03006777484' })
  @IsNotEmpty()
  phone: string;
}

export class ICompleteChangePhoneDto {
  @ApiProperty({ default: '03006777484' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  otp: string;
}

export class IChangeEmailDto {
  @ApiProperty({ default: 'khawajasaadmasood@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ICompleteChangePhoneEmail {
  @ApiProperty({ default: 'khawajasaadmasood@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  otp: string;
}
export interface IUserResponse extends Document {
  avatar: string;
  name: string;
  email: string;
  legalName: string;
  phone: string;
  role: string;
  emailVerified: boolean;
  passwordSetup: boolean;
}
