import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from '../users/user';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // POST /api/auth/register
  async register(dto: RegisterDto): Promise<User> {
    // 1. ¿Ya existe ese email? → 409
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    // 2. Calculamos el hash: la contraseña nunca se guarda tal cual
    const passwordHash = await argon2.hash(dto.password);

    // 3. Lo guardamos y devolvemos el usuario sin el hash
    return this.usersService.create(dto.email, passwordHash);
  }

  // POST /api/auth/login
  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    // 1. Buscamos el usuario
    const user = await this.usersService.findByEmail(dto.email);

    // 2. Si no existe o la contraseña no coincide → 401 con el MISMO mensaje
    if (!user || !(await argon2.verify(user.password_hash, dto.password))) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    // 3. Creamos el token. Dentro va solo el id
    const payload: JwtPayload = { sub: user.id };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
