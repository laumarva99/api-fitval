import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService],
  exports: [UsersService], // auth (y luego classes) lo necesitan
})
export class UsersModule {}
