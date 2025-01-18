import { Controller, Request, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const payload = { email: req.user.email, sub: req.user._id };

    // Gera o token
    const accessToken = this.jwtService.sign(payload);

    // Armazena o token no cookie HttpOnly
    response.cookie('access_token', accessToken, {
      httpOnly: true,        // Protege contra XSS
      secure: process.env.NODE_ENV === 'production', // Somente HTTPS em produção
      sameSite: 'strict',    // Protege contra CSRF
      maxAge: 3600000,       // 1 hora (tempo de expiração)
    });

    // Retorna apenas informações básicas do usuário (sem o token)
    return { message: 'Login successful', user: req.user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    // Limpa o cookie ao fazer logout
    response.clearCookie('access_token');
    return { message: 'Logout successful' };
  }
}
