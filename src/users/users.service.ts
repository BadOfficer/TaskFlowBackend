import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './user.interface';
import * as bcrypt from "bcrypt";
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import { updateUserDto } from './dto/update-user.dto';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async createUser(dto : CreateUserDto): Promise<{message: string}> {
        const {email, username, password} = dto;
        const existUser = await this.findUser({ email });

        if (existUser) {
            throw new BadRequestException(`User with email - ${email} is exist`)
        }

        const hashedPass = await this.hashPassword(password);

        await this.prismaService.user.create({
            data: {
                username,
                email,
                password: hashedPass
            }
        })

        return {
            message: "User has been created"
        }
    }

    async updateUser(id: string, dto: updateUserDto): Promise<{message: string}> {
        const user = await this.findUser({ id });

        if(!user) {
            throw new NotFoundException(`User ${id} not found`)
        }

        const isPasswordMatched = user.password === dto.confirmedPassword;
        const newPassword = (dto.password && isPasswordMatched) 
                                ? await this.hashPassword(dto.password) 
                                : user.password;

        await this.prismaService.user.update({
            where: {
                id
            },
            data: {
                username: dto.username,
                password: newPassword
            }
        })

        return {
            message: "User has been updated"
        }
    }

    async deleteUser(id: string): Promise<string> {
        const user = this.findUser({ id });

        if (!user) {
            throw new BadRequestException(`User ${id} not found`)
        }

        await this.prismaService.user.delete({
            where: {
                id
            }
        })

        return "User has been deleted"
    }

    async findUser<T extends Prisma.UserWhereUniqueInput>(data: T): Promise<User> {
        return this.prismaService.user.findUnique({
            where: data
        })
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, saltOrRounds)
    }
}
