import { TaskPriority, TaskStatus } from "@prisma/client";

export class ResponseTaskDto {
    id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    category: {
        id: string;
        title: string;
    };
    dueTime: Date;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
}