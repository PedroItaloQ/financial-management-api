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
          return request?.cookies?.access_token; // 🔥 Extraindo o token dos cookies
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SESSION_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('🔹 Validando token JWT:', payload);
    return { _id: payload.sub, email: payload.email }; // 🔥 Agora retorna _id corretamente!
  }
}
