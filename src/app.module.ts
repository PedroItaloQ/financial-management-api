import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module'; // Novo módulo para autenticação
import * as session from 'express-session';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule, // Adicionado
  ],
})
export class AppModule {
  configure(consumer: any) {
    consumer
      .apply(
        session({
          secret: process.env.SESSION_SECRET || 'secret_key',
          resave: false,
          saveUninitialized: false,
          cookie: { secure: false }, // Para produção, configure como `true`
        }),
      )
      .forRoutes('*');
  }
}
