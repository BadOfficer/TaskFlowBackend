import { IsNotEmpty, IsString } from "class-validator";

export class RequestCategoryDto {
    @IsString({ message: "Title must be a string" })
    @IsNotEmpty({ message: "Title cannot be empty" })
    readonly title: string;
}