import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { IMessageResponse } from 'src/shared/shared.dto';
import {
  IChangeEmailDto,
  IChangePasswordDto,
  IChangePhoneDto,
  ICompleteChangePhoneDto,
  ICompleteChangePhoneEmail,
  ICompleteSignupDto,
  IForgotPasswordDto,
  IResetPasswordDto,
  ISetupAccountDto,
  ISignInDto,
  ISignupDto,
  IUpdateBioDto,
  IValidateResetPasswordDto,
} from './user.dto';
import { UserService } from './user.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { imageParseFilePipeBuilder } from 'src/helpers/image.parser';
import { ExtractJwt } from 'passport-jwt';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('sign-up')
  async signup(@Body() dto: ISignupDto): Promise<IMessageResponse> {
    const otp = await this.userService.signup(dto);
    return {
      message: `We have sent a one time otp ${otp} to ${dto.email}`,
    };
  }

  @Post('complete-signup')
  async completeSignup(@Body() dto: ICompleteSignupDto) {
    const { user, token } = await this.userService.completeSignup(dto);
    return {
      user,
      jwt: token,
    };
  }


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Patch('setup-account')
  async setupAccount(@Body() dto: ISetupAccountDto) {
    console.log('ectracted', ExtractJwt.fromAuthHeaderAsBearerToken());
    const { user, token } = await this.userService.setupAccount(dto);
    return {
      user,
      jwt: token,
    };
  }

  @Post('sign-in')
  async signIn(@Body() dto: ISignInDto) {
    const { user, token } = await this.userService.signIn(dto);
    return {
      user,
      jwt: token,
    };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: IForgotPasswordDto,
  ): Promise<IMessageResponse> {
    const otp = await this.userService.forgotPassword(dto);
    return {
      message: `We have sent a one time otp ${otp} to ${dto.email}`,
    };
  }

  @Post('validate-reset-password')
  async ValidateResetPassword(@Body() dto: IValidateResetPasswordDto) {
    const { user, token } = await this.userService.validateResetPassword(dto);
    return {
      user,
      jwt: token,
    };
  }

 @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Patch('reset-password')
  async resetPassword(@Body() dto: IResetPasswordDto) {
    const user = await this.userService.resetPassword(dto);
    return user;
  }

 @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Patch('update-bio')
  async updateBio(@Body() dto: IUpdateBioDto) {
    const { user, token } = await this.userService.updateBio(dto);
    return {
      user,
      jwt: token,
    };
  }

 @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Patch('change-password')
  async changePassword(@Body() dto: IChangePasswordDto) {
    const user = await this.userService.changePassword(dto);
    return user;
  }

 @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('change-phone')
  async changePhone(@Body() dto: IChangePhoneDto): Promise<IMessageResponse> {
    const otp = await this.userService.changePhone(dto);
    return {
      message: `We have sent a one time otp ${otp} to ${dto.phone}`,
    };
  }

 @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('complete-change-phone')
  async completeChangePhone(@Body() dto: ICompleteChangePhoneDto) {
    const user = await this.userService.completeChangePhone(dto);
    return user;
  }

 @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('change-email')
  async changeEmail(@Body() dto: IChangeEmailDto): Promise<IMessageResponse> {
    const otp = await this.userService.changeEmail(dto);
    return {
      message: `We have sent a one time otp ${otp} to ${dto.email}`,
    };
  }

 @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Patch('complete-change-email')
  async completeChangeEmail(@Body() dto: ICompleteChangePhoneEmail) {
    const { user, token } = await this.userService.completeChangeEmail(dto);
    return {
      user,
      jwt: token,
    };
  }

 @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Patch('change-avatar')
  async changeAvatar(
    @UploadedFile(imageParseFilePipeBuilder)
    file: any,
  ) {
    const user = await this.userService.changeAvatar(file);
    return user;
  }
}
