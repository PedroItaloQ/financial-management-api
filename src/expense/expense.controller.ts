import { Controller, Post, Put, Body, Get, Query, Param, UseGuards, Request } from '@nestjs/common';
import { ExpensesService } from './expense.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async addExpense(
    @Body('categoryId') categoryId: string,
    @Body('amount') amount: number,
    @Body('description') description: string,
    @Request() req,
  ) {
    return this.expensesService.addExpense(categoryId, amount, description, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateExpense(
    @Param('id') expenseId: string,
    @Body('categoryId') categoryId: string,
    @Body('amount') amount: number,
    @Body('description') description: string,
    @Request() req,
  ) {
    return this.expensesService.updateExpense(expenseId, categoryId, amount, description, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getExpenses(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('userId') userId?: string,
    @Query('categoryId') categoryId?: string
  ) {
    return this.expensesService.getFilteredExpenses(Number(page), Number(limit), userId, categoryId);
  }
}
