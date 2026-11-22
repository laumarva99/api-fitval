import { toTrainer, TrainerRow } from './trainer';

describe('toTrainer', () => {
  it('junta las filas de un monitor en uno con sus especialidades', () => {
    // 1. Preparar: dos filas de Carla, una por especialidad
    const rows: TrainerRow[] = [
      {
        id: 1,
        name: 'Carla Navarro',
        email: 'carla@gym.com',
        photo_url: null,
        specialty: 'Ciclo indoor',
      },
      {
        id: 1,
        name: 'Carla Navarro',
        email: 'carla@gym.com',
        photo_url: null,
        specialty: 'Fuerza',
      },
    ];

    // 2. Ejecutar
    const trainer = toTrainer(rows);

    // 3. Comprobar
    expect(trainer).toEqual({
      id: 1,
      name: 'Carla Navarro',
      email: 'carla@gym.com',
      photoUrl: null,
      specialties: ['Ciclo indoor', 'Fuerza'],
    });
  });
});
