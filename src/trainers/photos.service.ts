import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// La extensión sale del tipo de archivo, nunca del nombre que manda el usuario
const EXTENSIONS: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
};

@Injectable()
export class PhotosService {
  // Un nombre nuevo y único: 3f2a...c1.png
  private newFileName(file: Express.Multer.File): string {
    return randomUUID() + EXTENSIONS[file.mimetype];
  }

  // Guarda la imagen en la carpeta uploads/ del servidor
  async saveLocal(file: Express.Multer.File): Promise<string> {
    const fileName = this.newFileName(file);
    await mkdir('uploads', { recursive: true }); // crea la carpeta si no existe
    await writeFile(join('uploads', fileName), file.buffer); // guarda los bytes
    return `/uploads/${fileName}`; // la dirección para verla
  }
}
