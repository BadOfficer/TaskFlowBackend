import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCategoryDto {
    @IsString({ message: "Category id must be a string" })
    @IsNotEmpty({ message: "Category id cannot be empty" })
    readonly id: string

    @IsString({ message: "Title must be a string" })
    @IsNotEmpty({ message: "Title cannot be empty" })
    readonly title: string;
}