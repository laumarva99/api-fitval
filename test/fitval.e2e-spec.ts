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
      .post('/api/auth/register')
      .send({ email, password });

    // TODO 2: POST /api/auth/login con los mismos datos
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
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
    const response = await request(app.getHttpServer()).get('/api/classes');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/classes/abc responde 400', async () => {
    const response = await request(app.getHttpServer()).get('/api/classes/abc');

    expect(response.status).toBe(400);
  });

  it('GET /api/classes/999999 responde 404', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/classes/999999',
    );

    expect(response.status).toBe(404);
  });

  it('POST /api/classes sin token responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/classes')
      .send(newClass);

    expect(response.status).toBe(401);
  });

  it('POST /api/auth/login con una contraseña mal responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password: 'otraclave' });

    expect(response.status).toBe(401);
  });

  it('POST /api/classes con el token de un socio responde 403', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/classes')
      .set('Authorization', `Bearer ${memberToken}`)
      .send(newClass);

    expect(response.status).toBe(403);
  });
});
