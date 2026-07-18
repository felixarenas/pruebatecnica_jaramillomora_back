# Backend API — Jaramillo Mora (`auth`)

API REST con **NestJS 11**, **Prisma 7** (PostgreSQL) y **Redis**. Expone **autenticación JWT**, **carga de archivos IFC** (base64) y un **pipeline de procesamiento IFC/BIM** con [`web-ifc`](https://github.com/ThatOpen/engine_web-ifc) que parsea el modelo y persiste su dominio para alimentar visores 3D y gráficas.

> ℹ️ **Alcance actual:** el proyecto **evolucionó** de un CRUD de `clientes`/`servicios` hacia un **procesador de modelos IFC**. Esos módulos fueron **eliminados** del código; el contexto completo (arquitectura, capas, diagramas) está en [`AGENTS.md`](./AGENTS.md).

| Recurso | Valor |
|---------|--------|
| Prefijo API | `/api/v1/` |
| Swagger UI | `/api-docs` |
| Storage público (visor 3D) | `/storage/<archivo>` |
| Contexto para agentes IA / arquitectura | [`AGENTS.md`](./AGENTS.md) |
| Skills del proyecto | [`.agents/skills/`](./.agents/skills/) |
| Bitácora de cambios | [`CHANGELOG.md`](./CHANGELOG.md) |

---

## Arquitectura (resumen)

Arquitectura por **capas + feature modules + repository pattern** sobre NestJS. Diagramas completos (capas, secuencia IFC, modelo de datos) en [`AGENTS.md`](./AGENTS.md#2-diagrama-de-arquitectura-capas).

```
Cliente (Angular :4200)
   │ HTTPS api/v1 · GET /storage
   ▼
Bootstrap HTTP (main.ts): CORS · body limits · ValidationPipe · /storage · Swagger
   ▼
Transversal @Global: ResponseInterceptor · GlobalExceptionFilter · JwtAuthGuard/Auth
                     Redis · AdminFile · IfcProcessing · Prisma
   ▼
Feature Modules (controllers):  UsersModule · ProcessIfcModule
   ▼
Servicios (casos de uso):  AuthService · ProcessIfcService · IfcProcessingService · …
   ▼
Dominio (tokens abstractos + entities):  *Repository
   ▼
Infraestructura:  Prisma*Repository · RedisService · AdminFile(fs) · web-ifc(WASM)
   ▼
PostgreSQL 17 · Redis :6390 · Filesystem (src/storage)
```

---

## Requisitos

- **Node.js** 24.x (alineado con la imagen Docker `node:24.14.1-alpine`)
- **npm** (incluido con Node)
- **Docker** + **Docker Compose** (infra y/o API en contenedor)
- PostgreSQL y Redis: vía Compose (recomendado) o instancias propias

Opcional: crear de antemano las rutas de bind mounts (`POSTGRES_DATA_PATH`, `REDIS_DATA_PATH`, `REDIS_LOGS_PATH`) con permisos de escritura.

---

## Configuración de entorno

```bash
cp .env.example .env
# Completar .env (nunca subir secretos al repositorio)
```

### Variables principales

| Variable | Descripción |
|----------|-------------|
| `SERVER_PORT` | Puerto HTTP de la API (Compose y `.env.example`: `3050`) |
| `HOST` | Host anunciado en logs (ej. `localhost`) |
| `BODY_LIMIT` | Límite del body JSON/urlencoded para base64 IFC/PDF (ej. `100mb`) |
| `CORS_ORIGINS` | Orígenes CORS permitidos, coma-separados (incluye `http://localhost:4200`) |
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USER`, `DB_PASSWORD` | Credenciales Postgres |
| `DATABASE_URL` | URL Prisma, ej. `postgres://USER:PASS@localhost:5453/DB?schema=public` |
| `POSTGRES_DATA_PATH` | Ruta absoluta en el host para el volumen de datos Postgres (Compose) |
| `DURATION_TOKEN` | Caducidad JWT (ej. `15d`) |
| `SECRECT_KEY` | Secreto JWT (**nombre con typo histórico; no renombrar sin migrar envs**) |
| `REDIS_HOST` / `REDIS_HOST_DOCKER` | `localhost` en dev local; en Compose la API usa `redis-cache-jm` |
| `REDIS_PORT` | Debe ser **6390** (coincide con `redis/redis.conf`) |
| `REDIS_PASSWORD` | Password Redis |
| `REDIS_DB`, `REDIS_SESSION_DB`, `REDIS_CACHE_DB` | Índices lógicos Redis |
| `REDIS_TTL`, `REDIS_MAX_ITEMS` | Caché Nest |
| `REDIS_DATA_PATH`, `REDIS_LOGS_PATH` | Bind mounts Redis |
| `REDIS_COMMANDER_PORT` | UI Redis Commander (profile `tools`) |
| `REDIS_MAXMEMORY`, `REDIS_MEMORY_*` | Límites de memoria Redis/Compose |

El archivo tipado de lectura es `src/core/config/envs.ts`. Si añades una variable nueva, decláralas ahí y en `.env.example`.

> **Notas clave**
> - Redis escucha en **6390** (`redis/redis.conf`). El healthcheck de Compose usa ese puerto; `redis-cli` por defecto usa `6379` y marcaría el contenedor como *unhealthy*.
> - Con `docker compose`, la API sobrescribe `DB_HOST` / `DATABASE_URL` / `REDIS_HOST` / `SERVER_PORT` para hablar con los servicios de la red interna (no uses `localhost` del host dentro del contenedor).

---

## Arranque en desarrollo

### Opción A — Infra en Docker + API en el host (recomendada para coding)

```bash
# 1. Variables
cp .env.example .env
# API local: REDIS_HOST=localhost, REDIS_PORT=6390
# DATABASE_URL apuntando a localhost:5453

# 2. Postgres + Redis
docker compose up -d postgres-db-jm redis-cache-jm

# 3. Dependencias y cliente Prisma
npm install            # 'postinstall' ejecuta 'prisma generate'
npx prisma generate

# 4. (Una vez) crear funciones SQL de agregación IFC — ver sección "Funciones SQL IFC"

# 5. API con watch
npm run start:dev
```

- API: `http://localhost:<SERVER_PORT>` (según `.env`)
- Swagger: `http://localhost:<SERVER_PORT>/api-docs`
- Storage: `http://localhost:<SERVER_PORT>/storage`
- Postgres host: `localhost:5453` · Redis host: `localhost:6390`

### Opción B — Stack completo con Compose (API en contenedor)

```bash
cp .env.example .env
# Ajustar POSTGRES_DATA_PATH y secretos

docker compose up -d --build
```

| Servicio | Contenedor | Puerto host |
|----------|------------|-------------|
| Postgres | `postgres-db-jm` | `5453` → `5432` |
| Redis | `redis-cache-jm` | `6390` → `6390` |
| API | `api-auth-jm` | `3050` → `3050` |

El servicio API usa el stage Docker **`development`**, monta el código y ejecuta `start_docker.sh` (install, `prisma generate`, build, **pm2** sobre `dist/src/main.js`).

Redis Commander (opcional):

```bash
docker compose --profile tools up -d redis-commander-jm
# UI: http://localhost:8091 (o REDIS_COMMANDER_PORT)
```

---

## Funciones SQL IFC (paso obligatorio)

El endpoint `POST api/v1/process-ifc/process-property-sets-ifc` agrega datos con **funciones de PostgreSQL** invocadas vía `$queryRaw`:

- `public.get_elementbynivel(id_model)`
- `public.get_elementbycategory(id_model)`

Estas funciones **no** están en `init-scripts/init-db.sql`; deben crearse en la base de datos (referencia de patrones en `db/plsql/`). Sin ellas, ese endpoint falla al construir `elementsDB`. Aplica el SQL una vez tras levantar Postgres, por ejemplo:

```bash
# Con psql contra la DB local (ajusta credenciales/puerto)
psql "postgres://USER:PASS@localhost:5453/DB" -f db/plsql/<archivo>.sql
```

---

## Uso rápido de la API

```bash
# 1. Login (público) → obtener accessToken
curl -X POST http://localhost:3050/api/v1/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"usuario","passwd":"secreto"}'

# 2. Subir un IFC en base64 (JWT requerido)
curl -X POST http://localhost:3050/api/v1/process-ifc \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"nom_file":"modelo_edificio","ext":"ifc","size":1024,"base64":"<BASE64>"}'

# 3. Procesar y obtener datos para graficar (parseo web-ifc + persistencia)
curl -X POST http://localhost:3050/api/v1/process-ifc/process-property-sets-ifc \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"nom_file":"modelo_edificio.ifc"}'

# 4. Listar archivos IFC cargados (con URL pública /storage)
curl http://localhost:3050/api/v1/process-ifc/getFileIfcAll \
  -H "Authorization: Bearer <TOKEN>"
```

Endpoints completos: ver Swagger en `/api-docs` o [`AGENTS.md` §5.1](./AGENTS.md#51-endpoints-existentes-resumen).

---

## Scripts npm útiles

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

`postinstall` ejecuta `prisma generate` automáticamente; `prebuild` ejecuta `docs:build`.

---

## Arranque en producción

### 1. Build y ejecución directa

```bash
npm ci
npx prisma generate
npm run build
NODE_ENV=production npm run start:prod
```

Asegura que `DATABASE_URL`, `SECRECT_KEY`, `CORS_ORIGINS`, `BODY_LIMIT`, Redis y `SERVER_PORT` estén definidos en el entorno de ejecución (no uses valores de desarrollo).

> El script `start:prod` apunta a `node dist/main`. Verifica en tu `dist/` la ruta real del entrypoint tras el build (`dist/main.js` vs `dist/src/main.js`) y alinea el script o el `CMD` Docker si difieren (el stage `production` del Dockerfile usa `node dist/src/main.js`).

### 2. Imagen Docker multi-stage (API)

Dockerfile: `dockerfile/api/Dockerfile`

| Stage | Uso |
|-------|-----|
| `development` | Hot path / Compose actual (bind mounts + pm2) |
| `builder` | `npm run build` + deps de producción |
| `production` | Imagen final: `node dist/src/main.js`, `EXPOSE 3050` |

```bash
docker build -f dockerfile/api/Dockerfile --target production -t api-auth-jm:prod .

docker run --rm --env-file .env \
  -e REDIS_HOST=<host-redis-accesible> \
  -e DB_HOST=<host-postgres-accesible> \
  -p 3050:3050 \
  api-auth-jm:prod
```

### 3. Consideraciones de producción

1. Construir/usar `--target production` en el servicio API (el Compose actual está orientado a **desarrollo**).
2. No montar el código fuente como volumen.
3. Fijar `NODE_ENV=production` y secretos robustos (`SECRECT_KEY`).
4. Postgres y Redis como servicios gestionados o contenedores con volúmenes persistentes y backups (`backup_db.sh` / carpeta `backups/`).
5. Aplicar las **funciones SQL IFC** en la DB de producción.
6. Persistir/backup del directorio `src/storage` (archivos IFC subidos).
7. Exponer solo los puertos necesarios detrás de un reverse proxy (hay `vhost-auth.conf` como referencia) y revisar límites de memoria Redis y healthchecks.

---

## Modelo de datos (Prisma)

Archivo: `prisma/schema.prisma` (schema SQL `public`). Diagrama ER en [`AGENTS.md` §2.2](./AGENTS.md#22-modelo-de-datos-ifc-prisma-postgresql).

**Dominio IFC (activo):**

- `ref_files` → archivos IFC cargados (nombre + ruta storage)
- `modelo_ifc` → cabecera del modelo parseado (esquema, app creadora, totales)
- `agrupacion_ifc` → estructura espacial (sitio, edificio, niveles, espacios, zonas)
- `elemento_ifc` → elementos contables por agrupación
- `property_set` → property sets por elemento
- `propiedad_parametro` → propiedades/parámetros por pset
- `cantidad_ifc` → cantidades físicas por elemento

**Autenticación:**

- `identity_type`, `users`

**Legacy (tablas sin módulo Nest):** `clientes`, `servicios`, `tipo_servicios` (permanecen por reflejo de la DB; no hay features que las expongan).

Flujo de esquema (reflejo desde la DB, sin `prisma/migrations/`):

```bash
npm run prisma:generate:models   # prisma db pull + generate
```

Inicialización de DB en Docker: `init-scripts/init-db.sql` (montado en el entrypoint de Postgres). Recuerda además crear las **funciones SQL IFC** (sección anterior).

---

## Desarrollar nuevos objetos (guía rápida)

Sigue el patrón de **`src/modules/process-ifc/`** (o `users/`). Contexto ampliado y checklist detallado: [`AGENTS.md` §8](./AGENTS.md#8-cómo-extender-checklist-para-agentes).

### Feature module

```
src/modules/<feature>/
  <feature>.module.ts
  controllers/<usecase>/...
  controllers/dto/int|out/
  controllers/mappers/
  services/<usecase>/
  repositories/
  interfaces/          # clase abstracta = token DI
  entities/
```

1. **Entity** de dominio → **Interface** abstracta del repositorio (token DI) → **Prisma repository** con `PrismaService`.
2. **Service** por caso de uso → **DTOs** int/out con `class-validator` + Swagger → **Mapper** entity ↔ DTO.
3. **Controller** delgado; `@UseGuards(JwtAuthGuard)` + `@ApiBearerAuth('JWT-auth')` salvo endpoints públicos.
4. Registrar el repositorio: `{ provide: MiRepository, useClass: PrismaMiRepository }` y añadir el módulo a `imports` de `src/app.module.ts`.
5. Respuestas: devolver `{ datos, mensaje }`; el `ResponseInterceptor` global arma `ResponseGeneralDto`.
6. Caché (opcional): inyectar `RedisService` (`src/core/redis/`, ya global).

### Nueva tabla del dominio IFC

Crea su micro-módulo `<tabla>-ifc.module.ts` (token + Prisma impl), impórtalo en `IfcProcessingModule`, inyecta el repo en `IfcProcessingService` y añade su paso idempotente. Detalle en [`AGENTS.md` §8](./AGENTS.md#8-cómo-extender-checklist-para-agentes).

### Calidad y convenciones

```bash
npm run lint
npm run test
```

- Convenciones Nest obligatorias: skill **nestjs-best-practices** en `.agents/skills/nestjs-best-practices/`.
- Commits (cuando se pidan): skills **commiter** + **changelog-manager** (Conventional Commits + `CHANGELOG.md`).

---

## Docker — resumen de archivos

| Archivo | Rol |
|---------|-----|
| `docker-compose.yml` | Orquestación Postgres, Redis, API, Redis Commander (`red_jaramillomora`) |
| `dockerfile/api/Dockerfile` | Stages development / builder / production |
| `dockerfile/db/Dockerfile` | Imagen Postgres + init |
| `start_docker.sh` | Entrypoint contenedor API (dev, pm2) |
| `redis/redis.conf` | Redis en puerto 6390, persistencia RDB+AOF |

---

## Solución de problemas

| Problema | Qué revisar |
|----------|-------------|
| API no conecta a Redis | `REDIS_HOST` / `REDIS_PORT=6390` / password; en Compose el hostname es `redis-cache-jm` |
| Prisma no genera cliente | `DATABASE_URL` válida; `npx prisma generate` |
| Postgres no inicia | `POSTGRES_DATA_PATH` existe y es escribible; logs del contenedor |
| `process-property-sets-ifc` falla | Faltan funciones SQL `get_elementbynivel` / `get_elementbycategory` en la DB |
| Error base64 / body demasiado grande | Ajustar `BODY_LIMIT` (ej. `100mb`) |
| Fetch a `/storage` bloqueado (CORS) | Añadir el origen del frontend a `CORS_ORIGINS` |
| JWT inválido | `SECRECT_KEY` y `DURATION_TOKEN` iguales en todos los entornos que firman/verifican |
| Puerto ocupado | Liberar `SERVER_PORT` / `3050` / `5453` / `6390` |
| Create user "no existe" en API | `CreateUserController` no está registrado en `UsersModule` (deuda conocida; ver `AGENTS.md`) |

---

## Licencia

Proyecto privado (`UNLICENSED`).
