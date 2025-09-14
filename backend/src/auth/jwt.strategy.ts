import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    //passes secret and bearer token to passport strategy, used in validation
    super({
      secretOrKey: config.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: any) {
    return {
      id: payload.id,
      roleId: payload.roleId,
      roleName: payload.roleName,
      email: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName
    };
  }
}
