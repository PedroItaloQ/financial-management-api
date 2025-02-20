import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard) // 🔥 Garantindo que o usuário está autenticado
  @Post('create')
  async createCategory(@Body('name') name: string, @Request() req) {
    console.log('🔹 Criando categoria, Usuário autenticado:', req.user);

    if (!req.user) {
      throw new Error('Usuário não autenticado! Verifique se o token está sendo enviado corretamente.');
    }

    return this.categoriesService.createCategory(name, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }
}
