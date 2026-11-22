import {
  Body,
  Post,
  UseGuards,
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { AuthGuard } from '../auth/auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { CreateTrainerDto } from './dto/create-trainer.dto';

@Controller('trainers') // /api/v1/trainers
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Get(':id') // GET /api/v1/trainers/1 → el monitor con sus especialidades
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trainersService.findOne(id);
  }
  @Post() // POST /api/v1/trainers → 201
  @UseGuards(AuthGuard, StaffGuard) // solo personal
  create(@Body() dto: CreateTrainerDto) {
    return this.trainersService.create(dto);
  }
}
