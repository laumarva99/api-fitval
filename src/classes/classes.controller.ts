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
  Version,
} from '@nestjs/common';

import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { AuthGuard } from '../auth/auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { ListClassesQueryDto } from './dto/list-classes-query.dto';

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

  @Get() // GET /api/v2/classes?page=...&limit=...&sort=...&order=...&activity=...
  @Version('2')
  findPage(@Query() query: ListClassesQueryDto) {
    return this.classesService.findPage(query);
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
