import { Module } from '@nestjs/common';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { PhotosService } from './photos.service';

@Module({
  imports: [DatabaseModule, UsersModule], // el Pool y el StaffGuard
  controllers: [TrainersController],
  providers: [TrainersService, PhotosService],
})
export class TrainersModule {}
