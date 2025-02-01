import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { RequestCategoryDto } from './dto/request-category.dto';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@Auth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('/:userId')
  async createCategory(@Param('userId') userId: string, @Body() dto: RequestCategoryDto): Promise<ResponseCategoryDto> {
    return this.categoriesService.createCategory({ userId, dto });
  }

  @Put('/:userId/:categoryId')
  async updateCategory(@Param('userId') userId: string, @Param('categoryId') categoryId: string, @Body() dto: RequestCategoryDto): Promise<ResponseCategoryDto> {
    return this.categoriesService.updateCategory({userId, categoryId, dto});
  }

  @Get("/all/:userId")
  async getAllByUser(@Param('userId') userId: string): Promise<ResponseCategoryDto[]> {
    return this.categoriesService.findAllByUser(userId);
  }

  @Get("/:id")
  async getCategoryById(@Param('id') id: string): Promise<ResponseCategoryDto> {
    return this.categoriesService.findCategoryById(id);
  }

  @Delete('/:id')
  async deleteCategory(@Param('id') id: string): Promise<{ message: string} > {
    return this.categoriesService.deleteCategory(id);
  }
}
