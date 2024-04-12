import {
  IChangeEmailDto,
  IChangePasswordDto,
  IChangePhoneDto,
  ICompleteChangePhoneDto,
  ICompleteChangePhoneEmail,
  ICompleteSignupDto,
  IForgotPasswordDto,
  IJwtPayload,
  IResetPasswordDto,
  ISetupAccountDto,
  ISignInDto,
  ISignupDto,
  IUpdateBioDto,
  IUserResponse,
  IValidateResetPasswordDto,
} from './user.dto';
import { InjectModel } from '@nestjs/mongoose';

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import {
  IRequest,
  checkEmailAvailability,
  compareHash,
  genOtp,
  makeHash,
} from 'src/helpers/helperFunctions';
import { JwtService } from '@nestjs/jwt';
import { Registration, RegistrationDocument } from './Registration.schema';
import { REQUEST } from '@nestjs/core';
import { ImageGateway } from 'src/services/image.gateway.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(REQUEST) private readonly request: IRequest,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Registration.name)
    private registrationModel: Model<RegistrationDocument>,
    private jwtService: JwtService,
    private readonly imageKitService: ImageGateway,
  ) {}

  async signup(dto: ISignupDto): Promise<string> {
    await checkEmailAvailability(this.userModel, dto.email);

    //deleting existing registrations
    const count = await this.registrationModel.countDocuments({
      email: dto.email,
    });
    if (count) await this.registrationModel.deleteMany({ email: dto.email });

    const otp = genOtp();
    const registration = new this.registrationModel({
      email: dto.email,
      otpHash: makeHash(otp),
    });
    await registration.save();
    return otp;
  }

  async completeSignup(dto: ICompleteSignupDto) {
    const registration = await this.registrationModel.findOne({
      email: dto.email,
    });

    if (!registration) {
      throw new HttpException(
        'Registration not found for this resource',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!compareHash(dto.otp, registration.otpHash)) {
      throw new HttpException('Invalid OTP', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    await this.registrationModel.deleteOne({ email: dto.email });

    const user = new this.userModel({
      email: dto.email,
      otpHash: null,
    });

    await user.save();

    const token = await this.signUser(user);

    return { user, token };
  }

  async setupAccount(dto: ISetupAccountDto) {
    const user = this.request.user;

    // Check if account setup is already completed
    if (user.passwordHash) {
      throw new HttpException(
        `Account setup for ${user.email} has already been completed with phone number ${dto.phone}`,
        HttpStatus.FORBIDDEN,
      );
    }

    // Validate password length
    if (dto.password.length < 8) {
      throw new HttpException(
        'Password is too short, must be at least 8 characters.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if phone number is already in use
    const existingUser = await this.userModel.findOne({ phone: dto.phone });
    if (existingUser) {
      throw new HttpException(
        'Phone number must be unique.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Update user information and save to database
    user.name = dto.name;
    user.passwordHash = makeHash(dto.password);
    user.phone = dto.phone;
    await user.save();

    // Generate authentication token
    const token = await this.signUser(user);

    // Return updated user information and token
    return { user, token };
  }
  async signIn(dto: ISignInDto) {
    const user = await this.userModel.findOne({ email: dto.email });

    // Check if user exists
    if (!user) {
      throw new HttpException(
        'No account linked with this email found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Check if password is correct
    const isPasswordValid =
      user.passwordHash && compareHash(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Generate authentication token
    const token = await this.signUser(user);

    // Return user and token
    return { user, token };
  }

  async forgotPassword(model: IForgotPasswordDto) {
    // Find user by email
    const user = await this.userModel.findOne({ email: model.email });

    // Check if user exists
    if (!user) {
      throw new HttpException(
        'No account linked with this email found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Generate OTP and hash it
    const otp = genOtp();
    user.otpHash = makeHash(otp);

    // Save OTP hash to the user document
    await user.save();

    // TODO: Send OTP through mail
    //  email sending logic

    // Return the OTP for testing purposes
    return otp;
  }

  async validateResetPassword(dto: IValidateResetPasswordDto) {
    // Find user by email
    const user = await this.userModel.findOne({ email: dto.email });

    // Check if user exists
    if (!user) {
      throw new HttpException(
        'No account linked with this email found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Check if OTP is valid
    if (!compareHash(dto.otp, user.otpHash)) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    // Clear OTP hash
    user.otpHash = null;
    await user.save();

    // Generate authentication token
    const token = await this.signUser(user);

    // Return token and user
    return { token, user };
  }

  async resetPassword(model: IResetPasswordDto) {
    const user = this.request.user;

    // Update user's password hash
    user.passwordHash = makeHash(model.password);

    // Save the updated user object
    await user.save();

    // Return the updated user object
    return user;
  }

  async updateBio(dto: IUpdateBioDto) {
    const { legalName, name } = dto;

    // Destructure the user object from this.request
    const { user } = this.request;

    // Update user properties
    user.legalName = legalName;
    user.name = name;

    // Save the updated user asynchronously
    await user.save();

    // Sign the user asynchronously to get a new token
    const token = await this.signUser(user);

    // Return the updated user object and token
    return { user, token };
  }

  async changePassword(dto: IChangePasswordDto) {
    const { user } = this.request;
    const { oldPassword, newPassword } = dto;

    // Check if the old password matches the current password hash
    const isOldPasswordCorrect = compareHash(oldPassword, user.passwordHash);
    if (!isOldPasswordCorrect) {
      throw new HttpException(
        'Old password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if the new password is the same as the old password
    if (oldPassword === newPassword) {
      throw new HttpException(
        'New password must be different from the old password',
        HttpStatus.CONFLICT,
      );
    }

    // Update the password hash with the new password
    user.passwordHash = makeHash(newPassword);
    await user.save();

    return user;
  }
  async changePhone(dto: IChangePhoneDto) {
    const { user } = this.request;

    // Check if the new phone number matches the current phone number
    if (user.phone === dto.phone) {
      throw new HttpException(
        'Your phone is already matched with your primary phone!',
        HttpStatus.CONFLICT,
      );
    }

    // Check if the new phone number is already associated with another user
    const userFound = await this.userModel.findOne({ phone: dto.phone });
    if (userFound) {
      throw new HttpException(
        'Phone number must be unique.',
        HttpStatus.CONFLICT,
      );
    }

    // Generate OTP and update user's phone and OTP hash
    const otp = genOtp();
    user.phone = dto.phone;
    user.otpHash = makeHash(otp);
    await user.save();

    return otp;
  }

  async completeChangePhone(dto: ICompleteChangePhoneDto) {
    const user = this.request.user;

    // Check if the provided phone matches the current user's phone
    if (user.phone !== dto.phone) {
      throw new HttpException('Request is not valid', HttpStatus.BAD_REQUEST);
    }

    // Compare the provided OTP with the stored OTP hash
    const isOTPValid = compareHash(dto.otp, user.otpHash);
    if (!isOTPValid) {
      throw new HttpException('OTP is invalid', HttpStatus.BAD_REQUEST);
    }

    // Update user's phone number
    user.phone = dto.phone;
    user.secondaryPhone = null;

    await user.save();

    return user;
  }

  async changeEmail(dto: IChangeEmailDto) {
    const user = this.request.user;
    const userFound = await this.userModel.findOne({ email: dto.email });
    if (userFound) {
      throw new HttpException(
        'Your email is already matched with your primary email!',
        HttpStatus.CONFLICT,
      );
    }

    const otp = genOtp();
    user.secondaryEmail = dto.email;
    user.otpHash = makeHash(otp);
    await user.save();
    //TODO: send otp through email
    return otp;
  }

  async completeChangeEmail(dto: ICompleteChangePhoneEmail) {
    const user = this.request.user;

    // Check if the provided email matches the current user's secondary email
    if (user.secondaryEmail !== dto.email) {
      throw new HttpException('Request is not valid', HttpStatus.BAD_REQUEST);
    }

    // Compare the provided OTP with the stored OTP hash
    const isOTPValid = compareHash(dto.otp, user.otpHash);
    if (!isOTPValid) {
      throw new HttpException('OTP is invalid', HttpStatus.BAD_REQUEST);
    }

    // Update user's email and clear secondary email
    user.email = dto.email;
    user.secondaryEmail = null;

    await user.save();

    // Sign user and return updated user object with token
    const token = await this.signUser(user);

    return { user, token };
  }

  async changeAvatar(file: any) {
    const user = this.request.user;
    const { thumbnailUrl } = await this.imageKitService.upload(file);
    user.avatar = thumbnailUrl;
    await user.save();
    return user;
  }

  //=================================================================================================================================================
  //============================================================== helper functions =======================================================================
  //=================================================================================================================================================
  private async signUser(user: UserDocument): Promise<string> {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  async findOneById(id: string) {
    return this.userModel.findById(id);
  }

  async prepareUser(user: UserDocument) {
    const dto: IUserResponse = {
      avatar: user.avatar,
      name: user.name,
      legalName: user.legalName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      emailVerified: user.isEmailVerified,
      passwordSetup: user.isPasswordSetup,
    } as IUserResponse;
    return dto;
  }
  async collection(users: UserDocument[]) {
    return Promise.all(users.map((user) => user));
  }
}
