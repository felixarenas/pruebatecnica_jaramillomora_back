# Backend API — Jaramillo Mora (`auth`)

API REST con **NestJS 11**, **Prisma 7** (PostgreSQL) y **Redis**. Expone autenticación JWT y CRUD de usuarios, clientes y servicios.

| Recurso | Valor |
|---------|--------|
| Prefijo API | `/api/v1/` |
| Swagger UI | `/api-docs` |
| Contexto para agentes IA | [`AGENTS.md`](./AGENTS.md) |
| Skills del proyecto | [`.agents/skills/`](./.agents/skills/) |

---

## Requisitos

- **Node.js** 24.x (alineado con la imagen Docker `node:24.14.1-alpine`)
- **npm** (incluido con Node)
- **Docker** + **Docker Compose** (infra y/o API en contenedor)
- PostgreSQL y Redis: vía Compose (recomendado) o instancias propias

Opcional: crear de antemano las rutas de bind mounts de datos (`POSTGRES_DATA_PATH`, `REDIS_DATA_PATH`, `REDIS_LOGS_PATH`) con permisos de escritura.

---

## Configuración de entorno

1. Copiar la plantilla:

```bash
cp .env.example .env
```

2. Completar `.env` (nunca subir secretos al repositorio).

### Variables principales

| Variable | Descripción |
|----------|-------------|
| `SERVER_PORT` | Puerto HTTP de la API (local tipico `3001`; Compose mapea `3050`) |
| `HOST` | Host anunciado en logs (ej. `localhost`) |
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USER`, `DB_PASSWORD` | Credenciales Postgres |
| `DATABASE_URL` | URL Prisma, ej. `postgres://USER:PASS@HOST:PORT/DB?schema=public` |
| `POSTGRES_DATA_PATH` | Ruta absoluta en el host para el volumen de datos Postgres (Compose) |
| `DURATION_TOKEN` | Caducidad JWT (ej. `15d`) |
| `SECRECT_KEY` | Secreto JWT (**nombre con typo histórico; no renombrar sin migrar envs**) |
| `REDIS_HOST` | `localhost` en desarrollo local; en Compose la API usa `redis-cache-jm` |
| `REDIS_PORT` | Debe ser **6390** (coincide con `redis/redis.conf`) |
| `REDIS_PASSWORD` | Password Redis |
| `REDIS_DB`, `REDIS_SESSION_DB`, `REDIS_CACHE_DB` | Índices lógicos Redis |
| `REDIS_TTL`, `REDIS_MAX_ITEMS` | Caché Nest |
| `REDIS_DATA_PATH`, `REDIS_LOGS_PATH` | Bind mounts Redis |
| `REDIS_COMMANDER_PORT` | UI Redis Commander (profile `tools`) |
| `REDIS_MAXMEMORY`, `REDIS_MEMORY_*` | Límites de memoria Redis/Compose |

El archivo tipado de lectura es `src/core/config/envs.ts`. Si añades una variable nueva, declárala ahí y en `.env.example`.

> **Nota:** en este proyecto Redis escucha en **6390** (`redis/redis.conf`). El healthcheck de Compose debe usar ese puerto; `redis-cli` por defecto usa `6379` y marcaría el contenedor como *unhealthy*.
>
> Con `docker compose`, la API sobrescribe `DB_HOST`/`DATABASE_URL`/`REDIS_HOST`/`SERVER_PORT` para hablar con los servicios de la red interna (no uses `localhost` del host dentro del contenedor).

---

## Arranque en desarrollo

### Opción A — Solo infra en Docker + API en el host (recomendada para coding)

```bash
# 1. Variables
cp .env.example .env
# Editar .env: DB_*, DATABASE_URL, REDIS_*, SECRECT_KEY, POSTGRES_DATA_PATH, etc.
# Para API local: REDIS_HOST=localhost, REDIS_PORT=6390
# DATABASE_URL apuntando a localhost:5453

# 2. Postgres + Redis
docker compose up -d postgres-db-jm redis-cache-jm

# 3. Dependencias y cliente Prisma
npm install
npx prisma generate

# 4. API con watch
npm run start:dev
```

- API: `http://localhost:<SERVER_PORT>` (según `.env`)
- Swagger: `http://localhost:<SERVER_PORT>/api-docs`
- Postgres host: `localhost:5453`
- Redis host: `localhost:6390`

### Opción B — Stack completo con Compose (API en contenedor)

```bash
cp .env.example .env
# Ajustar paths de volúmenes y secretos
# SERVER_PORT dentro del contenedor debe coincidir con el mapeo (Compose usa 3050:3050)

docker compose up -d --build
```

Servicios:

| Servicio | Contenedor | Puerto host |
|----------|------------|-------------|
| Postgres | `postgres-db-jm` | `5453` → `5432` |
| Redis | `redis-cache-jm` | `6390` → `6390` |
| API | `api-auth-jm` | `3050` → `3050` |

El servicio API usa el stage Docker **`development`**, monta el código y ejecuta `start_docker.sh` (install, `prisma generate`, build, **pm2**).

Redis Commander (opcional):

```bash
docker compose --profile tools up -d redis-commander-jm
```

UI por defecto: `http://localhost:8091` (o `REDIS_COMMANDER_PORT`).

### Scripts npm útiles

| Script | Qué hace |
|--------|----------|
| `npm run start:dev` | Limpia y arranca Nest en watch |
| `npm run start:debug` | Nest debug + watch |
| `npm run build` | Genera docs embebidas, limpia y compila (`nest build`) |
| `npm run start:prod` | `node dist/main` (tras `build`) |
| `npm run prisma:generate:models` | `prisma db pull` + `generate` (reflejar schema desde DB) |
| `npx prisma generate` | Regenerar cliente sin pull |
| `npm run lint` | ESLint con fix |
| `npm run test` / `test:e2e` | Jest unitario / e2e |
| `npm run docs:build` | Embed de este README en `src/core/docs/readme.generated.ts` |

`postinstall` ejecuta `prisma generate` automáticamente.

---

## Arranque en producción

### 1. Build de la aplicación

```bash
npm ci
npx prisma generate
npm run build
NODE_ENV=production npm run start:prod
```

Asegura que `DATABASE_URL`, `SECRECT_KEY`, Redis y `SERVER_PORT` estén definidos en el entorno de ejecución (no uses valores de desarrollo).

> El script `start:prod` apunta a `node dist/main`. Verifica en tu `dist/` la ruta real del entrypoint tras el build (`dist/main.js` vs `dist/src/main.js`) y alinea el script o el `CMD` Docker si difieren.

### 2. Imagen Docker multi-stage (API)

Dockerfile: `dockerfile/api/Dockerfile`

| Stage | Uso |
|-------|-----|
| `development` | Hot path / Compose actual |
| `builder` | `npm run build` + deps de producción |
| `production` | Imagen final: `node dist/src/main.js`, `EXPOSE 3050` |

Ejemplo de build y ejecución del stage de producción:

```bash
docker build -f dockerfile/api/Dockerfile --target production -t api-auth-jm:prod .

docker run --rm --env-file .env \
  -e REDIS_HOST=<host-redis-accesible> \
  -p 3050:3050 \
  api-auth-jm:prod
```

Postgres y Redis en producción deben ser servicios gestionados o contenedores con volúmenes persistentes, backups (`backup_db.sh` / carpeta `backups/`) y secretos fuera del código.

### 3. Compose orientado a producción

El `docker-compose.yml` actual está pensado sobre todo para **desarrollo** (`target: development`, bind mounts, pm2). Para producción:

1. Construir/usar `--target production` en el servicio API.
2. No montar el código fuente como volumen.
3. Fijar `NODE_ENV=production` y secretos robustos.
4. Revisar límites de memoria Redis y healthchecks.
5. Exponer solo los puertos necesarios detrás de un reverse proxy (hay `vhost-auth.conf` como referencia).

---

## Modelo de datos (Prisma)

Archivo: `prisma/schema.prisma` (schema SQL `public`).

- `identity_type` → tipos de identificación
- `users` → usuarios del sistema (login)
- `clientes` → clientes de negocio
- `servicios` / `tipo_servicios` → servicios contratados y catálogo

Relaciones: tipos de id compartidos entre `users` y `clientes`; cada `servicio` pertenece a un `cliente` y a un `tipo_servicios`.

Inicialización de DB en Docker: `init-scripts/init-db.sql` (montado en el entrypoint de Postgres).

Si el esquema cambia en Postgres:

```bash
npm run prisma:generate:models
```

---

## Desarrollar nuevos objetos (guía rápida)

Sigue el patrón de **`src/modules/clientes/`** (o `servicios/`). Contexto ampliado: [`AGENTS.md`](./AGENTS.md).

### 1. Crear el feature module

```
src/modules/<feature>/
  <feature>.module.ts
  controllers/<usecase>/...
  controllers/dto/int|out/
  controllers/mappers/
  services/<usecase>/
  repositories/
  interfaces/
  entities/
```

### 2. Capas

1. **Entity** de dominio.
2. **Interface** abstracta del repositorio (token DI).
3. **Prisma repository** con `PrismaService`.
4. **Service** por caso de uso (crear, buscar, actualizar…).
5. **DTOs** de entrada/salida con `class-validator` y decoradores Swagger.
6. **Mapper** entity ↔ DTO.
7. **Controller**: delgado; `@UseGuards(JwtAuthGuard)` y `@ApiBearerAuth` si aplica.

### 3. Registrar

En `<feature>.module.ts`:

```typescript
{ provide: MiRepository, useClass: PrismaMiRepository }
```

En `src/app.module.ts`, añadir el módulo a `imports`.

### 4. Auth y respuestas

- Importar `AuthModule` desde `src/core/config/auth.module/`.
- Devolver datos; el `ResponseInterceptor` global arma la respuesta estándar.
- Opcional: `@ResponseMessage('...')`.

### 5. Caché (opcional)

Inyectar `RedisService` (`src/core/redis/`) — el módulo ya es global.

### 6. Calidad

```bash
npm run lint
npm run test
```

Convenciones Nest obligatorias del equipo: skill **nestjs-best-practices** en `.agents/skills/nestjs-best-practices/`.

Commits (cuando se pidan): skills **commiter** + **changelog-manager** (Conventional Commits + `CHANGELOG.md`).

---

## Módulos de negocio actuales

| Módulo | Ruta | Responsabilidad |
|--------|------|-----------------|
| Users | `src/modules/users/` | Login JWT, consulta/actualización de usuarios |
| Clientes | `src/modules/clientes/` | CRUD clientes y tipos de identificación |
| Servicios | `src/modules/servicios/` | CRUD servicios, tipos y consultas por cliente |

Infra transversal: `PrismaModule`, `RedisModule`, `AuthModule`, filter e interceptor globales.

---

## Docker — resumen de archivos

| Archivo | Rol |
|---------|-----|
| `docker-compose.yml` | Orquestación Postgres, Redis, API, Commander |
| `dockerfile/api/Dockerfile` | Stages development / builder / production |
| `dockerfile/db/Dockerfile` | Imagen Postgres + init |
| `start_docker.sh` | Entrypoint contenedor API (dev) |
| `redis/redis.conf` | Redis en puerto 6390, persistencia RDB+AOF |

Red Compose: `red_jaramillomora`.

---

## Solución de problemas

| Problema | Qué revisar |
|----------|-------------|
| API no conecta a Redis | `REDIS_HOST` / `REDIS_PORT=6390` / password; en Compose el hostname es `redis-cache-jm` |
| Prisma no genera cliente | `DATABASE_URL` válida; `npx prisma generate` |
| Postgres no inicia | `POSTGRES_DATA_PATH` existe y es escribible; logs del contenedor |
| JWT inválido | `SECRECT_KEY` y `DURATION_TOKEN` iguales en todos los entornos que firman/verifican |
| Puerto ocupado | Liberar `SERVER_PORT` / `3050` / `5453` / `6390` |
| Create user “no existe” en API | El controller de creación no está registrado en `UsersModule` (deuda conocida; ver `AGENTS.md`) |

---

## Licencia

Proyecto privado (`UNLICENSED`).
