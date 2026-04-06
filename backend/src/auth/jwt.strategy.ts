import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { blacklistedTokens } from './blacklist';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'mySecretKey',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: { sub: string; email: string }) {
    const authHeader = req.headers.authorization;

    if (typeof authHeader === 'string') {
      const token = authHeader.split(' ')[1];

      //  BLOCKLIST CHECK
      if (token && blacklistedTokens.has(token)) {
        throw new UnauthorizedException('Token expired');
      }
    }

    return payload;
  }
}
