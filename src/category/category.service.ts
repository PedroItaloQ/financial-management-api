import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { UserDocument } from '../users/users.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async createCategory(name: string, user: UserDocument): Promise<Category> {
    console.log('🔹 Service - Criando categoria com usuário:', user);

    if (!user || !user._id) {
      throw new Error('Erro: O usuário autenticado não contém um ID válido!');
    }

    const category = new this.categoryModel({ name, createdBy: user._id });
    return category.save();
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryModel.find().populate('createdBy').exec();
  }
}
