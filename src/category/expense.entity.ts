import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from '../category/category.schema';
import { User } from '../users/users.schema';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema({ timestamps: true })
export class Expense {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  addedBy: User;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
