import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CategoriesModule, TasksModule],
})
export class AppModule {}
