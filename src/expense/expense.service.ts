import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense, ExpenseDocument } from './expense.schema';
import { UserDocument } from '../users/users.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  async addExpense(categoryId: string, amount: number, description: string, user: UserDocument): Promise<Expense> {
    console.log("🛠️ Criando despesa...");
    console.log("🔹 categoryId:", categoryId);
    console.log("🔹 amount:", amount);
    console.log("🔹 description:", description);
    console.log("🔹 user:", user);

    if (!Types.ObjectId.isValid(categoryId)) {
      console.error("❌ ERRO: categoryId inválido:", categoryId);
      throw new BadRequestException("O categoryId fornecido não é válido.");
    }

    if (!user || !user._id || !Types.ObjectId.isValid(user._id.toString())) {
      console.error("❌ ERRO: Usuário não autenticado ou _id inválido.", user);
      throw new BadRequestException("Usuário não autenticado ou _id inválido.");
    }

    try {
      const expense = new this.expenseModel({
        amount,
        description,
        category: new Types.ObjectId(categoryId),
        addedBy: new Types.ObjectId(user._id.toString()),
      });

      const savedExpense = await expense.save();
      console.log("✅ Despesa criada com sucesso:", savedExpense);
      return savedExpense;
    } catch (error) {
      console.error("❌ ERRO INTERNO AO SALVAR DESPESA:", error);
      throw new InternalServerErrorException("Erro ao salvar despesa.");
    }
  }

  async getFilteredExpenses(
    page: number = 1,
    limit: number = 10,
    userId?: string,
    categoryId?: string
  ): Promise<{ expenses: Expense[]; total: number; totalPages: number }> {
    try {
      console.log("🔍 Buscando despesas com filtros...");

      const query: any = {};

      if (userId) {
        if (!Types.ObjectId.isValid(userId)) {
          throw new BadRequestException("O userId fornecido não é válido.");
        }
        query.addedBy = new Types.ObjectId(userId);
      }

      if (categoryId) {
        if (!Types.ObjectId.isValid(categoryId)) {
          throw new BadRequestException("O categoryId fornecido não é válido.");
        }
        query.category = new Types.ObjectId(categoryId);
      }

      const skip = (page - 1) * limit;

      const expenses = await this.expenseModel
        .find(query)
        .populate('category', 'name')
        .populate('addedBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await this.expenseModel.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      console.log("✅ Despesas encontradas:", expenses);
      return { expenses, total, totalPages };
    } catch (error) {
      console.error("❌ ERRO AO BUSCAR DESPESAS:", error);
      throw new InternalServerErrorException("Erro ao buscar despesas.");
    }
  }

  async updateExpense(
    expenseId: string,
    categoryId: string,
    amount: number,
    description: string,
    user: UserDocument
  ): Promise<Expense> {
    console.log("🔄 Atualizando despesa...");
    console.log("🔹 expenseId:", expenseId);
    console.log("🔹 categoryId:", categoryId);
    console.log("🔹 amount:", amount);
    console.log("🔹 description:", description);
    console.log("🔹 user:", user);
  
    if (!Types.ObjectId.isValid(expenseId)) {
      throw new BadRequestException("O ID da despesa fornecido não é válido.");
    }
  
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new BadRequestException("O ID da categoria fornecido não é válido.");
    }
  
    const existingExpense = await this.expenseModel.findById(expenseId);
    if (!existingExpense) {
      throw new BadRequestException("Despesa não encontrada.");
    }
  
    if (existingExpense.addedBy.toString() !== user._id.toString()) {
      throw new BadRequestException("Você não tem permissão para editar esta despesa.");
    }
  
    try {
      const updatedExpense = await this.expenseModel.findByIdAndUpdate(
        expenseId,
        {
          category: new Types.ObjectId(categoryId),
          amount,
          description,
        },
        { new: true }
      ).populate('category', 'name').populate('addedBy', 'username email');
  
      console.log("✅ Despesa atualizada com sucesso:", updatedExpense);
      return updatedExpense;
    } catch (error) {
      console.error("❌ ERRO INTERNO AO ATUALIZAR DESPESA:", error);
      throw new InternalServerErrorException("Erro ao atualizar despesa.");
    }
  }
}
