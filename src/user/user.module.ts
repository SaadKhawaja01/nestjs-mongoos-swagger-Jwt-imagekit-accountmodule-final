// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { UserService } from './user.service';
// import { Registration, RegistrationSchema } from './registration.schema';
// import { User, UserSchema } from './user.schema';
// import { ImageGateway } from 'src/services/image.gateway.service';
// import { UserController } from './user.controller';
// import environments from 'src/helpers/environments';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: User.name, schema: UserSchema },
//       { name: Registration.name, schema: RegistrationSchema },
//     ]),

//     // JwtModule.registerAsync({
//     //   imports: [ConfigModule],
//     //   useFactory: async (configService: ConfigService) => ({
//     //     secret:
//     //       environments.JwtSecret ,
//     //     signOptions: { expiresIn: environments.JWT_EXPIRY  },
//     //   }),
//     //   inject: [ConfigService],
//     // }),

//   ],
//   providers: [UserService, ImageGateway],
//   controllers: [UserController],
//   exports: [UserService],
// })
// export class UserModule {}

// user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import environments from 'src/helpers/environments';
import { JwtStrategy } from './guards/jwt.strategy';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { Registration, RegistrationSchema } from './Registration.schema';
import { ImageGateway } from 'src/services/image.gateway.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Registration.name, schema: RegistrationSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: environments.JwtSecret,
      signOptions: { expiresIn: environments.JWT_EXPIRY },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, ImageGateway],
  exports: [UserService],
})
export class UserModule {}
