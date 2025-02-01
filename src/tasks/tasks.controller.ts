import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RequestTaskDto } from './dto/request-task.dto';
import { ResponseTaskDto } from './dto/response-task.dto';

@Controller('tasks')
@Auth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('/:userId')
  async createTask(@Param('userId') userId: string, @Body() dto: RequestTaskDto): Promise<ResponseTaskDto> {
    return this.tasksService.createTask({ userId, dto })
  }

  @Put('/:id')
  async updateTask(@Param("id") id: string, @Body() dto: RequestTaskDto): Promise<ResponseTaskDto> {
    return this.tasksService.updateTask({ taskId: id, dto});
  }

  @Delete('/single/:id')
  async deleteTask(@Param("id") id: string): Promise<{ message: string }> {
    return this.tasksService.deleteTask(id);
  }

  @Delete('/many')
  async deleteTasks(@Body('tasksIds') tasksIds: string[]): Promise<{ message: string }> {
    return this.tasksService.deleteTasks(tasksIds);
  }

  @Get('/all/:userId')
  async getTasksByUser(@Param('userId') userId: string): Promise<ResponseTaskDto[]> {
    return this.tasksService.getTasksByUser(userId);
  }

  @Get('/single/:id')
  async getTaskById(@Param("id") id: string): Promise<ResponseTaskDto> {
    return this.tasksService.getTaskById(id);
  }
}
