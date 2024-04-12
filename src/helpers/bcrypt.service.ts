import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import environments from './environments';

export enum HashFor {
  Default = '',
  EmailOtp = 'EmailOtp',
  PhoneOtp = 'PhoneOtp',
}

@Injectable()
export class BcryptService {
  genSalt() {
    return bcrypt.genSaltSync(Number(environments.BASE_SALT_NUMBER));
  }

  genOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  makeHash(value: string) {
    return bcrypt.hashSync(value, this.genSalt());
  }

  compareHash(plain: string, hash: string) {
    if (!hash) {
      return false;
    }
    return bcrypt.compareSync(plain, hash);
  }
}
