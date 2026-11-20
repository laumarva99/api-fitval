import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { toTrainer, Trainer, TrainerRow } from './trainer';

@Injectable()
export class TrainersService {
  constructor(private readonly pool: Pool) {}

  // GET /api/v1/trainers/:id
  async findOne(id: number): Promise<Trainer> {
    // JOIN: el monitor + sus especialidades (a través de la tabla intermedia)
    const result = await this.pool.query<TrainerRow>(
      `SELECT t.id, t.name, t.email, s.name AS specialty
       FROM trainers t
       JOIN trainer_specialties ts ON ts.trainer_id = t.id
       JOIN specialties s ON s.id = ts.specialty_id
       WHERE t.id = $1
       ORDER BY s.id`,
      [id],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('Monitor no encontrado'); // → 404
    }
    return toTrainer(result.rows); // varias filas → un monitor
  }
}