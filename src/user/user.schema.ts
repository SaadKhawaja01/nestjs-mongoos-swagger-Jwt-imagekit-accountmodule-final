import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ICreateUserDto, IUserResponse } from './user.dto';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User implements ICreateUserDto {
  @Prop({
    default: 'http://www.gravatar.com/avatar/?d=identicon',
  })
  avatar: string;

  @Prop({
    default: () => 'User' + Date.now(),
  })
  name: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop()
  legalName?: string;

  @Prop()
  persona?: string;

  @Prop()
  secondaryEmail?: string;

  @Prop()
  emailVerifiedAt?: Date;

  @Prop()
  phone?: string;

  @Prop()
  secondaryPhone?: string;

  @Prop()
  passwordHash?: string;

  @Prop({
    default: 'Standard',
  })
  role: string;

  @Prop()
  otpHash?: string;

  // Getter functions
  get isEmailVerified(): boolean {
    return !!this.emailVerifiedAt;
  }

  get isPasswordSetup(): boolean {
    return !!this.passwordHash;
  }



  // async userResponse(): Promise<IUserResponse> {
  //   const dto: IUserResponse = {
  //     avatar: this.avatar,
  //     name: this.name,
  //     legalName: this.legalName,
  //     email: this.email,
  //     phone: this.phone,
  //     role: this.role,
  //     emailVerified: this.isEmailVerified,
  //     passwordSetup: this.isPasswordSetup,
  //   } as IUserResponse;
  //   return dto;
  // }
}

export const UserSchema = SchemaFactory.createForClass(User);
