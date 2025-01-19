import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true }) // Campo único
  username: string;

  @Prop({ required: true, unique: true }) // Adiciona email
  email: string;

  @Prop({ required: true }) // Campo obrigatório
  password: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
