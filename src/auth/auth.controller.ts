import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/user.interface';
import { ResponseTokens } from './response-tokens.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/sign-up")
  async register(@Body() dto: CreateUserDto): Promise<string> {
    return this.authService.register(dto);
  }

  @Post("/sign-in")
  async login(@Body() dto: LoginDto): Promise<User & ResponseTokens> {
    return this.authService.login(dto);
  }

  @Post("/refresh-tokens")
  async refreshTokens(@Body('refreshToken') refreshToken: string): Promise<User & ResponseTokens> {
    return this.authService.refreshTokens({ refreshToken });
  }
}
