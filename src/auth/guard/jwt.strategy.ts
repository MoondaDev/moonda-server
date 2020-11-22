import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { jwtConstants } from '../constants';
import { UserService } from '../../user/user.service';
import { tokenExtractor, JwtPayload } from '../../util/http';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([tokenExtractor]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const token = tokenExtractor(req);
    await this.authService.validateJwtToken(token);

    const user = await this.userService.findByEmail(payload.email);
    user.validateUserExit();

    return user;
  }
}
