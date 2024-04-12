import { Model } from 'mongoose';
import { UserDocument } from 'src/user/user.schema';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import environments from './environments';

export interface IRequest extends Request {
  user: UserDocument;
}

// Check if email is available
export async function checkEmailAvailability(
  userModel: Model<UserDocument>,
  email: string,
): Promise<void> {
  const user = await userModel.findOne({ email });
  if (user) {
    throw new Error('Email is already linked with another account');
  }
}

// Generate salt for bcrypt
export function genSalt(): string {
  return bcrypt.genSaltSync(Number(environments.BASE_SALT_NUMBER) || 10);
}

// Generate OTP (One Time Password)
export function genOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash a value using bcrypt
export function makeHash(value: string): string {
  const salt = genSalt();
  return bcrypt.hashSync(value, salt);
}

// Compare a plain text with a hash
export function compareHash(plain: string, hash: string): boolean {
  return bcrypt.compareSync(plain, hash);
}

// Throw HttpExceptions based on conditions
export function throwHttpException(message: string, status: HttpStatus): void {
  throw new HttpException(message, status);
}
