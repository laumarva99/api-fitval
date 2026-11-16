import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

const normalizeEmail = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class LoginDto {
  @Transform(normalizeEmail)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1) // que no venga vacía
  password: string;
}
