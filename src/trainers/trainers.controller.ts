import {
  Body,
  Post,
  UseGuards,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrainersService } from './trainers.service';
import { PhotosService } from './photos.service';
import { AuthGuard } from '../auth/auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { CreateTrainerDto } from './dto/create-trainer.dto';

// Las reglas de la imagen: como mucho 2 MB y solo PNG, JPG o WEBP
const photoPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: 2 * 1024 * 1024, // 2 MB en bytes
      message: 'La imagen no puede pasar de 2 MB',
    }),
    new FileTypeValidator({ fileType: /^image\/(png|jpeg|webp)$/ }),
  ],
});

@Controller('trainers') // /api/v1/trainers
export class TrainersController {
  constructor(
    private readonly trainersService: TrainersService,
    private readonly photosService: PhotosService,
  ) {}

  @Get(':id') // GET /api/v1/trainers/1 → el monitor con sus especialidades
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trainersService.findOne(id);
  }
  @Post() // POST /api/v1/trainers → 201
  @UseGuards(AuthGuard, StaffGuard) // solo personal
  create(@Body() dto: CreateTrainerDto) {
    return this.trainersService.create(dto);
  }

  // POST /api/v1/trainers/1/photo → guarda la foto en uploads/
  @Post(':id/photo')
  @UseGuards(AuthGuard, StaffGuard) // solo personal
  @UseInterceptors(FileInterceptor('photo')) // el campo del formulario se llama "photo"
  async uploadPhoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(photoPipe) file: Express.Multer.File,
  ) {
    await this.trainersService.findOne(id); // 404 si el monitor no existe
    const url = await this.photosService.saveLocal(file);
    return this.trainersService.setPhoto(id, url);
  }
}
