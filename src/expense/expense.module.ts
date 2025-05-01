import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './expense.schema';
import { ExpensesService } from './expense.service';
import { ExpensesController } from './expense.controller';
import { CategoriesModule } from '../category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    CategoriesModule,
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
