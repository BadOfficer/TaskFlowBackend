import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestTaskDto } from './dto/request-task.dto';
import { ResponseTaskDto } from './dto/response-task.dto';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class TasksService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly categoriesService: CategoriesService
    ) {}

    async createTask({userId, dto}: {userId: string, dto: RequestTaskDto}): Promise<ResponseTaskDto> {
        const { title, description, categoryId, dueTime, priority, status } = dto;
        const existUser = await this.usersService.findUser({ id: userId });

        if(!existUser) {
            throw new NotFoundException(`User - ${existUser.username} not found`)
        }

        const existCategory = await this.categoriesService.findCategoryById(categoryId);

        if(!existCategory) {
            throw new NotFoundException(`Category - ${categoryId} not found`)
        }

        return this.prismaService.task.create({
            data: {
                title,
                description,
                category: {
                    connect: {
                        id: categoryId
                    }
                },
                dueTime,
                author: {
                    connect: {
                        id: userId
                    }
                },
                priority,
                status
            }, 
            include: {
                category: {
                    select: {
                        id: true,
                        title: true
                    }                    
                }
            }
        })
    }

    async updateTask({taskId, dto}: {taskId: string, dto: RequestTaskDto}): Promise<ResponseTaskDto> {
        const { categoryId, ..._ } = dto;
    
        const existCategory = await this.categoriesService.findCategoryById(categoryId);

        if(!existCategory) {
            throw new NotFoundException(`Category - ${categoryId} not found`)
        }

        return this.prismaService.task.update({
            where: {
                id: taskId
            },
            data: {
                ...dto
            },
            include: {
                category: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        })
    }

    async deleteTask(id: string): Promise<{ message: string }> {
        const task = this.getTaskById(id);

        if(!task) {
            throw new NotFoundException(`Task - ${id} not found`)
        }

        await this.prismaService.task.delete({
            where: {
                id
            }
        })

        return {
            message: "Task deleted successfully"
        }
    }

    async deleteTasks(ids: string[]): Promise<{ message: string }> {
        await this.prismaService.task.deleteMany({
            where: {
                id: { in: ids }
            }
        })

        return {
            message: "Tasks deleted successfully"
        }
    }

    async getTasksByUser(userId: string): Promise<ResponseTaskDto[]> {
        const existUser = await this.usersService.findUser({ id: userId });

        if(!existUser) {
            throw new NotFoundException(`User - ${userId} not found!`)
        }

        const tasks = await this.prismaService.task.findMany({
            where: {
                authorId: userId
            },
            include: {
                category: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        })

        return tasks;
    }

    async getTaskById(id: string) {
        return this.prismaService.task.findUnique({
            where: {
                id
            },
            include: {
                category: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        })
    }
}
