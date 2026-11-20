import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { PlansModule } from './plans/plans.module';
import { ClassesModule } from './classes/classes.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 20 }], // 20 peticiones cada 60 segundos
      errorMessage: 'Demasiadas peticiones. Espera un poco.',
    }),
    DatabaseModule,
    PlansModule,
    ClassesModule,
    UsersModule,
    AuthModule,
  ], // para que AppController pueda pedir el Pool
  controllers: [AppController],
  providers: [
    // Activa el límite en TODAS las rutas
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
