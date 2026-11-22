import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Pool } from 'pg';
import request from 'supertest';
import { configureApp } from '../src/app.config';
import { AppModule } from '../src/app.module';

describe('API de FitVal', () => {
  let app: INestApplication;
  let memberToken: string; //el token de un socio

  // ...en el beforeAll, después de app.init():
  // Un correo distinto en cada ejecución, evita 409
  const email = `test-${Date.now()}@fitval.com`;
  const password = 'test12345';

  // Una clase válida, para los POST
  const newClass = {
    activity: 'Fuerza',
    room: 'Sala 3',
    startsAt: '2026-11-10T18:00:00Z',
    spots: 15,
    trainerId: 4,
  };

  // Antes de todos los tests: arrancamos la API entera
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app); // la misma configuración que main.ts
    await app.init();

    // TODO 1: POST /api/auth/register con ese email y una contraseña
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email, password });

    // TODO 2: POST /api/auth/login con los mismos datos
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password });

    // TODO 3: memberToken = el accessToken de la respuesta del login
    memberToken = (login.body as { accessToken: string }).accessToken;
  });

  // Después de todos: cerramos PostgreSQL y la API (si no, Jest no termina)
  afterAll(async () => {
    await app.get(Pool).end();
    await app.close();
  });

  it('GET /api/classes responde 200 con un array', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/classes');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/classes/abc responde 400', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/classes/abc',
    );

    expect(response.status).toBe(400);
  });

  it('GET /api/classes/999999 responde 404', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/classes/999999',
    );

    expect(response.status).toBe(404);
  });

  it('POST /api/classes sin token responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/classes')
      .send(newClass);

    expect(response.status).toBe(401);
  });

  it('POST /api/auth/login con una contraseña mal responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password: 'otraclave' });

    expect(response.status).toBe(401);
  });

  it('POST /api/classes con el token de un socio responde 403', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/classes')
      .set('Authorization', `Bearer ${memberToken}`)
      .send(newClass);

    expect(response.status).toBe(403);
  });

  // Integración
  it('GET /api/v2/classes?page=1&limit=3 trae 3 clases', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v2/classes?page=1&limit=3',
    );

    expect(response.status).toBe(200);
    expect((response.body as { data: unknown[] }).data).toHaveLength(3);
  });

  it('GET /api/v2/classes?limit=100 responde 400', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v2/classes?limit=100',
    );

    expect(response.status).toBe(400);
  });

  // tests de integración
  it('un 404 tiene la forma nueva', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/classes/999999',
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('path', '/api/v1/classes/999999');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('las respuestas no llevan la cabecera x-powered-by', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/health');

    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  // Ejercicio 10.4
  it('GET /api/v1/trainers/1 trae a Carla con sus especialidades', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/trainers/1',
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('specialties', [
      'Ciclo indoor',
      'Fuerza',
    ]);
  });

  it('subir una foto sin token responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/trainers/1/photo')
      .attach('photo', Buffer.from('hola'), 'foto.png');

    expect(response.status).toBe(401);
  });
});
