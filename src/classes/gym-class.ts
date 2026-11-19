// Así llega una clase desde PostgreSQL (con el nombre del monitor, del JOIN)
export interface GymClassRow {
  id: number;
  activity: string;
  room: string;
  starts_at: Date;
  spots: number;
  trainer_name: string;
}

// Así la devuelve nuestra API
export interface GymClass {
  id: number;
  activity: string;
  room: string;
  startsAt: Date;
  spots: number;
  trainerName: string;
}

// Convierte una fila en una clase de la API
export function toGymClass(row: GymClassRow): GymClass {
  return {
    id: row.id,
    activity: row.activity,
    room: row.room,
    startsAt: row.starts_at,
    spots: row.spots,
    trainerName: row.trainer_name,
  };
}

// Una página de clases (lo que devuelve la v2 de GET /classes)
export interface GymClassPage {
  data: GymClass[]; // las clases de esta página
  total: number; // cuántas clases hay en total (con el filtro)
  page: number; // página actual
  limit: number; // clases por página
  totalPages: number; // cuántas páginas hay
}
