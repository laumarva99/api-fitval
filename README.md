# API FitVal

API del gimnasio **FitVal**: planes, clases, monitores y reservas, con registro, login y permisos.

Está hecha con **NestJS** y **PostgreSQL**. Es la continuación de la entrega de SQL, donde diseñé la base de datos del gimnasio.
Tiene comentadas las partes que se le añaden al proyecto para mejorar la comprensión y lectura del cógido del ejercicio.

## Tecnologías

- Node.js 24
- NestJS 11
- TypeScript
- PostgreSQL 17 (con la librería `pg`)
- Docker (para ejecutar PostgreSQL)
- `class-validator` y `class-transformer` (validación de los datos)
- `argon2` (contraseñas) y JWT (login)
- ESLint y GitHub Actions (CI)

## Requisitos

- Node.js 24
- Docker

## Cómo arrancarla

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` como `.env` y pon tus valores:

   ```bash
   cp .env.example .env
   ```

3. Arranca PostgreSQL (crea el contenedor `postgres-fitval` en el puerto `5433`):

   ```bash
   docker compose up -d
   ```

4. Crea las tablas y carga los datos de prueba:

   ```bash
   docker exec -i postgres-fitval psql -U alumno -d fitval < database/schema.sql
   ```

   Se puede ejecutar todas las veces que quieras: borra todo y lo vuelve a crear.

5. Arranca la API:

   ```bash
   npm run start:dev
   ```

   La API queda en `http://localhost:3000/api`.

## Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `DATABASE_URL` | Dirección de PostgreSQL, con usuario y contraseña |
| `JWT_SECRET` | Clave secreta para firmar los tokens de login |

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run start:dev` | Arranca la API y la reinicia al guardar |
| `npm run lint` | Revisa el código con ESLint |
| `npm run build` | Compila el proyecto |

## Rutas

| Método | Ruta | Quién | Qué hace |
|---|---|---|---|
| `GET` | `/api/health` | Todos | Comprueba que la API y PostgreSQL funcionan |
| `GET` | `/api/plans` | Todos | Planes, del más barato al más caro |
| `GET` | `/api/classes` | Todos | Clases ordenadas por fecha (filtro: `activity`) |
| `GET` | `/api/classes/:id` | Todos | Una clase |
| `POST` | `/api/classes` | Personal | Crea una clase |
| `DELETE` | `/api/classes/:id` | Personal | Borra una clase (si no tiene reservas) |
| `POST` | `/api/auth/register` | Todos | Registra un usuario |
| `POST` | `/api/auth/login` | Todos | Inicia sesión y devuelve un token |
| `GET` | `/api/auth/me` | Con token | Datos del usuario que ha iniciado sesión |

Las rutas del **personal** necesitan un token de un usuario con rol `staff`. Se envía en la cabecera:

```text
Authorization: Bearer <token>
```

## Cómo trabajo

- La rama `main` está protegida: solo se cambia con una pull request.
- Cada funcionalidad va en su propia rama `feature/...` y su PR.
- El CI revisa el código con ESLint en cada PR. Solo se puede fusionar si sale en verde.