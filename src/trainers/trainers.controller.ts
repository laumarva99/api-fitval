import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TrainersService } from './trainers.service';

@Controller('trainers') // /api/v1/trainers
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Get(':id') // GET /api/v1/trainers/1 → el monitor con sus especialidades
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trainersService.findOne(id);
  }
}