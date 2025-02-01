import {IsEmail, IsString, IsNotEmpty} from 'class-validator'

export class LoginDto {

    @IsEmail({}, { message: "Email must be an email" })
    @IsString({ message: "Email must be string" })
    @IsNotEmpty({ message: "Email cannot be empty" })
    readonly email: string;
    readonly password: string;
}