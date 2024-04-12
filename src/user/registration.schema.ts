import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ICreateRegistrationDto } from './user.dto';

export type RegistrationDocument = HydratedDocument<Registration>;

@Schema()
export class Registration implements ICreateRegistrationDto {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  otpHash: string;
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);
