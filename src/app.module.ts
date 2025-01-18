import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module'; // Módulo de autenticação
import * as cookieParser from 'cookie-parser';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Carrega variáveis do arquivo .env
    }),
    MongooseModule.forRoot(process.env.MONGO_URI), // Conecta ao MongoDB
    UsersModule,
    AuthModule, // Importa o módulo de autenticação
  ],
})
export class AppModule {
  configure(consumer: any) {
    consumer
      .apply(cookieParser()) // Middleware para processar cookies
      .forRoutes('*');       // Aplica para todas as rotas
  }
}
