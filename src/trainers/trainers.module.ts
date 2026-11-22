import { Module } from '@nestjs/common';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule], // el Pool y el StaffGuard
  controllers: [TrainersController],
  providers: [TrainersService],
})
export class TrainersModule {}
