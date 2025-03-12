import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('LocalStrategy - Email:', email);
    console.log('LocalStrategy - Senha:', password);

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      console.log('LocalStrategy - Usuário não autorizado');
      throw new UnauthorizedException();
    }
    console.log('LocalStrategy - Usuário autorizado:', user);
    return user;
  }
}
