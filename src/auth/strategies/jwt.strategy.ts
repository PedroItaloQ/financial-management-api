import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token; // Busca o token nos cookies
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SESSION_SECRET, // Chave secreta do token
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
