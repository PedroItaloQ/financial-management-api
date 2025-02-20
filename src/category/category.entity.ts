import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/users.schema';
import { Expense } from '../expense/expense.schema';

export type CategoryDocument = Document & Category;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Expense' }] })
  expenses: Expense[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
