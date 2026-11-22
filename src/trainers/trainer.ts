// Una fila del JOIN entre trainers, trainer_specialties y specialties
export interface TrainerRow {
  id: number;
  name: string;
  email: string;
  specialty: string; // el nombre de una especialidad (s.name AS specialty)
  photo_url: string | null; // NULL si no tiene foto
}

// Un monitor con sus especialidades dentro, como lo devuelve la API
export interface Trainer {
  id: number;
  name: string;
  email: string;
  specialties: string[];
  photoUrl: string | null;
}

// Varias filas (una por especialidad) → un solo monitor con sus especialidades
export function toTrainer(rows: TrainerRow[]): Trainer {
  return {
    id: rows[0].id, // el id, el nombre y el email se repiten: los cogemos de la primera
    name: rows[0].name,
    email: rows[0].email,
    specialties: rows.map((row) => row.specialty),
    photoUrl: rows[0].photo_url, // como el id: se repite en todas las filas
  };
}
