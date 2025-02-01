import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    CategoriesModule,
    UsersModule,
    PrismaModule
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
