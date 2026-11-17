import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
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

    if (!user || user.role !== 'staff') {
      throw new ForbiddenException('Solo para el personal del gimnasio'); // → 403
    }

    return true;
  }
}
