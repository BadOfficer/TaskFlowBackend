import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: "Email must be an email" })
    @IsString({ message: "Email must be string" })
    @IsNotEmpty({ message: "Email cannot be empty" })
    readonly email: string;

    @IsNotEmpty({ message: "Username cannot be empty" })
    @IsString({ message: "Username must be string" })
    readonly username: string;

    @IsNotEmpty({ message: "Password cannot be empty"})
    @IsString({ message: "Password must be string" })
    readonly password: string;
}