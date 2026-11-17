import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { AuthGuard } from '../auth/auth.guard';
import { StaffGuard } from '../auth/staff.guard';

@Controller('classes') // rutas /api/classes
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get() // GET /api/classes?activity=...
  findAll(@Query('activity') activity?: string) {
    return this.classesService.findAll(activity);
  }

  @Get(':id') // GET /api/classes/:id
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.findOne(id);
  }

  @Post() // POST /api/classes
  @UseGuards(AuthGuard, StaffGuard) // solo personal
  create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }

  @Delete(':id') // DELETE /api/classes/:id
  @UseGuards(AuthGuard, StaffGuard) // solo personal
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.remove(id);
  }
}
