import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Pool } from 'pg';
import { GymClass, GymClassRow, toGymClass } from './gym-class';
import { CreateClassDto } from './dto/create-class.dto';

// El principio de todas las consultas de clases: cada clase con el nombre de su monitor
const SELECT_CLASSES = `
  SELECT c.id, c.activity, c.room, c.starts_at, c.spots, t.name AS trainer_name
  FROM classes c
  JOIN trainers t ON t.id = c.trainer_id
`;

@Injectable()
export class ClassesService {
  constructor(private readonly pool: Pool) {}

  // GET /api/classes y GET /api/classes?activity=yoga
  async findAll(activity?: string): Promise<GymClass[]> {
    // Con filtro: la actividad contiene el texto, sin mirar mayúsculas
    if (activity) {
      const result = await this.pool.query<GymClassRow>(
        `${SELECT_CLASSES} WHERE c.activity ILIKE '%' || $1 || '%' ORDER BY c.starts_at`,
        [activity],
      );
      return result.rows.map(toGymClass);
    }

    // Sin filtro: todas
    const result = await this.pool.query<GymClassRow>(
      `${SELECT_CLASSES} ORDER BY c.starts_at`,
    );
    return result.rows.map(toGymClass);
  }

  // GET /api/classes/:id
  async findOne(id: number): Promise<GymClass> {
    const result = await this.pool.query<GymClassRow>(
      `${SELECT_CLASSES} WHERE c.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`No existe ninguna clase con id ${id}`); // → 404
    }

    return toGymClass(result.rows[0]);
  }

  // POST /api/classes
  async create(dto: CreateClassDto): Promise<GymClass> {
    // 1. ¿Existe el monitor?
    const trainer = await this.pool.query(
      'SELECT id FROM trainers WHERE id = $1',
      [dto.trainerId],
    );
    if (trainer.rows.length === 0) {
      throw new BadRequestException(
        'No existe ningún monitor con ese trainerId',
      ); // → 400
    }

    // 2. Guardamos la clase. RETURNING nos da su id nuevo
    const result = await this.pool.query<{ id: number }>(
      `INSERT INTO classes (activity, room, starts_at, spots, trainer_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [dto.activity, dto.room, dto.startsAt, dto.spots, dto.trainerId],
    );

    // 3. Devolvemos la clase completa, con el nombre del monitor
    return this.findOne(result.rows[0].id);
  }

  // DELETE /api/classes/:id
  async remove(id: number): Promise<GymClass> {
    // 1. ¿Existe? findOne ya lanza el 404 si no
    const gymClass = await this.findOne(id);

    // 2. ¿Tiene reservas? COUNT llega como texto: ::int lo convierte en número
    const bookings = await this.pool.query<{ total: number }>(
      'SELECT COUNT(*)::int AS total FROM bookings WHERE class_id = $1',
      [id],
    );
    if (bookings.rows[0].total > 0) {
      throw new ConflictException(
        `No se puede borrar: la clase tiene ${bookings.rows[0].total} reservas`,
      ); // → 409
    }

    // 3. La borramos y devolvemos la clase que había
    await this.pool.query('DELETE FROM classes WHERE id = $1', [id]);
    return gymClass;
  }
}
