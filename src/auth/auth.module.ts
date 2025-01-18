import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module'; // Importe o UsersModule aqui
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller'; // Importe o controlador
import * as dotenv from 'dotenv';
dotenv.config();

console.log('MONGO_URI:', process.env.MONGO_URI); // Verifica a conexão com o banco
console.log('SESSION_SECRET:', process.env.SESSION_SECRET); // Verifica a chave secreta


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.SESSION_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  controllers: [AuthController], // Adicione o AuthController aqui
  providers: [AuthService, JwtStrategy, LocalStrategy], // Inclua o LocalStrategy
})

export class AuthModule {}
