import type { Request } from 'express';

// Lo que va dentro del token: solo el id del usuario
export interface JwtPayload {
  sub: number; // "subject": el id del usuario
}

// Una petición que ya ha pasado por el AuthGuard: lleva el payload en request.user
export interface AuthRequest extends Request {
  user: JwtPayload;
}
