import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    readonly email: string;

    @IsNotEmpty({ message: "Username cannot be empty" })
    readonly username: string;

    @IsNotEmpty({ message: "Password cannot be empty"})
    readonly password: string;
}