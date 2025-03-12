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
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const payload = { email: req.user.email, sub: req.user._id };

    const accessToken = this.jwtService.sign(payload);

    response.cookie('access_token', accessToken, {
      httpOnly: true,  // Protege contra XSS
      secure: false,   // Defina `true` se estiver rodando em HTTPS
      sameSite: 'lax', // Permite envio entre frontend e backend
      maxAge: 3600000, // Expira em 1 hora
    });

    return { message: 'Login successful', user: req.user };
  }


  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logout successful' };
  }
}
