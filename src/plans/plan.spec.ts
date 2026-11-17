import { PlanRow, toPlan } from './plan';

describe('toPlan', () => {
  it('convierte el precio de texto a número', () => {
    // 1. Preparar: el precio llega como texto, como lo devuelve PostgreSQL
    const row: PlanRow = { id: 1, name: 'Básico', monthly_price: '29.90' };

    // 2. Ejecutar
    const plan = toPlan(row);

    // 3. Comprobar: tiene que ser el número 29.9
    expect(plan.monthlyPrice).toBe(30);
  });
});
