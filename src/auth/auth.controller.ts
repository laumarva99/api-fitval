import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { AuthRequest } from './jwt-payload';
import { Throttle } from '@nestjs/throttler';

@Controller('auth') // rutas /api/auth
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register') // POST /api/auth/register → 201
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } }) // solo 5 intentos por minuto
  @Post('login') // POST /api/auth/login
  @HttpCode(200) // un login no crea nada: 200, no 201
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me') // GET /api/auth/me
  @UseGuards(AuthGuard) // solo con un token válido
  async me(@Req() request: AuthRequest) {
    const user = await this.usersService.findById(request.user.sub);
    if (!user) {
      throw new UnauthorizedException('El usuario ya no existe');
    }
    return user;
  }
}
