import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

// Quita espacios y pasa a minúsculas: "  Ana@Gym.com " → "ana@gym.com"
const normalizeEmail = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class RegisterDto {
  @Transform(normalizeEmail)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8) // mínimo 8 caracteres
  @MaxLength(100)
  password: string;
}
