import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest, JwtPayload } from './jwt-payload';

// Deja pasar solo las peticiones con un token válido
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // 1. La cabecera tiene que ser "Authorization: Bearer <token>"
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Falta el token'); // → 401
    }

    // 2. ¿Está bien firmado y no ha caducado?
    try {
      request.user = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Token no válido'); // → 401
    }

    return true; // puede pasar
  }
}
