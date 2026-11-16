import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule, // para usar UsersService
    JwtModule.registerAsync({
      global: true, // el AuthGuard también se usará en classes
      useFactory: () => ({
        secret: process.env.JWT_SECRET, // la clave del .env
        signOptions: { expiresIn: 3600 }, // el token caduca en 1 hora (3600 s)
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
