import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../user.dto';
import environments from 'src/helpers/environments';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) // private readonly jwtService: JwtService, // Inject JwtService
  {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environments.JwtSecret,
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.userModel.findById(payload.id);

    if (!user || user.email !== payload.email) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
