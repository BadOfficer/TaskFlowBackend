import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ResponseTokens } from './response-tokens.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(dto: CreateUserDto): Promise<string> {
        await this.usersService.createUser(dto);

        return "User has been registered successfully"
    }

    async login(dto: LoginDto): Promise<User & ResponseTokens> {
        const validateUser = await this.validateUser({
            email: dto.email,
            password: dto.password
        })

        const tokens = this.issueTokens({ userId: validateUser.id })

        return {
            ...validateUser,
            ...tokens
        }
    }

    async refreshTokens({refreshToken}: {refreshToken: string}): Promise<User & ResponseTokens> {
        const verifyToken = await this.jwtService.verify(refreshToken);

        if(!verifyToken) {
            throw new UnauthorizedException("Invalid refresh token")
        }

        const user = await this.usersService.findUser({ id: verifyToken.userId });

        const tokens = this.issueTokens({
            userId: user.id
        })

        return {
            ...user,
            ...tokens
        }
    }

    private async validateUser({email, password}: {email: string, password: string}): Promise<User> {
        const existUser = await this.usersService.findUser({ email });

        if(!existUser) {
            throw new UnauthorizedException("Invalid credentials")
        }

        const validatePassword = await bcrypt.compare(password, existUser.password);
        
        if(!validatePassword) {
            throw new UnauthorizedException("Invalid credentials")
        }

        return existUser;
    }

    private issueTokens(payload: {userId: string}): ResponseTokens {
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '24h'
        })

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d'
        })

        return {
            accessToken,
            refreshToken
        }
    }
}
