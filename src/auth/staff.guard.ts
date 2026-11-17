import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthRequest } from './jwt-payload';

// Deja pasar solo al personal del gimnasio.
// Va SIEMPRE después de AuthGuard, que es quien rellena request.user
@Injectable()
export class StaffGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // El rol se lee de la base de datos, no del token
    const user = await this.usersService.findById(request.user.sub);

    // El token es válido, pero el usuario ya no existe → 401
    if (!user) {
      throw new UnauthorizedException('El usuario ya no existe');
    }

    // Existe, pero no es personal → 403
    if (user.role !== 'staff') {
      throw new ForbiddenException('Solo para el personal del gimnasio');
    }

    return true;
  }
}
