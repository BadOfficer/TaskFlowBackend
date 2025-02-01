import { TaskPriority, TaskStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RequestTaskDto {
    @IsString({ message: "Title must be as string" })
    @IsNotEmpty({ message: "Title cannot be empty" })
    title: string;

    @IsString({ message: "Description must be as string" })
    @IsNotEmpty({ message: "Description cannot be empty" })
    description: string;

    @IsOptional()
    priority: TaskPriority;

    @IsString({ message: "Category must be as string" })
    @IsNotEmpty({ message: "Category cannot be empty" })
    categoryId: string;

    @Type(() => Date)
    @IsDate({ message: "Due Time must be a valid Date" })
    @IsNotEmpty({ message: "Due Time cannot be empty" })
    dueTime: Date;

    @IsOptional()
    status: TaskStatus;
}