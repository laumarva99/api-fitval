import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// Quita los espacios de los lados si es un texto
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

// Lo que tiene que enviar el cliente para crear una clase
export class CreateClassDto {
  @Transform(trim)
  @IsString()
  @MinLength(1)
  @MaxLength(50) // como VARCHAR(50)
  activity: string;

  @Transform(trim)
  @IsString()
  @MinLength(1)
  @MaxLength(30) // como VARCHAR(30)
  room: string;

  @IsDateString() // fecha y hora en formato ISO: "2026-11-10T18:00:00Z"
  startsAt: string;

  @IsInt()
  @Min(1) // como CHECK (spots > 0)
  spots: number;

  @IsInt()
  @Min(1)
  trainerId: number; // que exista lo comprobamos en el servicio
}
