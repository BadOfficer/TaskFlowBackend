import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestCategoryDto } from './dto/request-category.dto';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prismaService: PrismaService) {}

    async createCategory({userId, dto}: {userId: string, dto: RequestCategoryDto}): Promise<ResponseCategoryDto> {
        const existCategory = await this.prismaService.category.findFirst({
            where: {
                title: dto.title,
                userId: userId
            }
        })

        if (existCategory) {
            throw new BadRequestException(`Category ${dto.title} is exist`)
        }
        
        const newCategory = await this.prismaService.category.create({
            data: {
                title: dto.title,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return {
            id: newCategory.id,
            title: newCategory.title
        }
    }

    async updateCategory({userId, categoryId, dto}: {userId: string, categoryId: string, dto: RequestCategoryDto}): Promise<ResponseCategoryDto> {
        const existCategory = await this.findCategoryById(categoryId);

        if(!existCategory) {
            throw new NotFoundException(`Category with id - ${categoryId} not found`)
        }

        const existCategoryByTitle = await this.prismaService.category.findFirst({
            where: {
                title: dto.title,
                userId
            }
        })

        if (existCategoryByTitle) {
            throw new BadRequestException(`Category ${dto.title} is exist`)
        }

        return this.prismaService.category.update({
            where: {
                id: categoryId
            },
            data: {
                title: dto.title
            }
        })
    }

    async deleteCategory(id: string): Promise<{message: string}> {
        const existCategory = await this.findCategoryById(id);

        if(!existCategory) {
            throw new NotFoundException(`Category with id - ${id} not found`)
        }

        return {
            message: `Category ${existCategory.title} has been deleted`
        }
    }

    async findCategoryById(id: string) {
        return this.prismaService.category.findUnique({
            where: {
                id
            }
        })
    }

    async findAllByUser(userId: string) {
        return this.prismaService.category.findMany({
            where: {
                userId
            }
        })
    }
}
