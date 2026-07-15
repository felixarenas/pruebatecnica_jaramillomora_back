# AGENTS.md — Contexto de la aplicación (Backend Jaramillo Mora)

Documento de contexto para agentes de IA generativa y desarrolladores humanos. Debe leerse **antes** de escribir o modificar código. Complementa (no sustituye) el `README.md` operativo.

---

## 1. Qué es este proyecto

API REST de autenticación y gestión de negocio (usuarios, clientes, servicios) construida con **NestJS 11**, **Prisma 7** (PostgreSQL) y **Redis** (caché). Paquete npm: `auth` (`0.0.1`, privado).

- Prefijo HTTP global: `api/v1/`
- Documentación OpenAPI: `/api-docs`
- Autenticación: JWT Bearer (`JwtAuthGuard`); login público en `POST api/v1/users/auth/login`
- Respuestas HTTP envoltorio uniforme vía `ResponseInterceptor` + `ResponseGeneralDto`

Dominio de datos principal (schema Prisma `public`):

```
identity_type 1──* users
identity_type 1──* clientes
clientes      1──* servicios
tipo_servicios 1──* servicios
```

---

## 2. Stack (versiones de referencia)

| Capa | Tecnología |
|------|------------|
| Runtime | Node.js 24 (Docker: `24.14.1-alpine`), TypeScript ^5.7 |
| Framework | NestJS ^11 (`@nestjs/common`, `core`, `platform-express`) |
| ORM | Prisma ^7.8 + `@prisma/adapter-pg` + `pg` |
| DB | PostgreSQL 17 (imagen Docker `17.9-alpine3.22`) |
| Cache | Redis (`redis:alpine3.23`, puerto app **6390**), `@nestjs/cache-manager` |
| Auth | `@nestjs/jwt` + `bcrypt` |
| Validación | `class-validator` / `class-transformer` (+ `zod` en deps) |
| Config | `dotenv` + `env-var` (`src/core/config/envs.ts`) — **no** se usa `ConfigModule` de Nest en el bootstrap |
| API docs | `@nestjs/swagger` |

Dependencias presentes pero **sin uso en features actuales** de `src/`: LangChain (`langchain`, `@langchain/openai`), `@nestjs/microservices`. No inventar integraciones con ellas salvo que el usuario lo pida.

---

## 3. Estructura del repositorio

```
backend/
├── AGENTS.md                 # Este archivo (contexto para agentes)
├── README.md                 # Guía humana: build, dev, prod
├── .agents/skills/           # Skills obligatorias del proyecto (ver §6)
├── src/
│   ├── main.ts               # Bootstrap, ValidationPipe, Swagger, filtros
│   ├── app.module.ts         # Prisma, Users, Clientes, Servicios, Redis
│   ├── core/                 # Transversal (config, redis, guards, filters…)
│   └── modules/              # Feature modules (dominio)
├── prisma/                   # schema.prisma, PrismaModule
├── dockerfile/api|db/        # Multi-stage API + Postgres init
├── docker-compose.yml
├── redis/redis.conf          # Redis escucha en 6390
├── init-scripts/             # SQL de inicialización Postgres
└── scripts/embed-readme.mjs  # Embed de README en build (`docs:build`)
```

### 3.1 Patrón de un feature module (obligatorio)

Organizar por **feature / caso de uso**, no por capa técnica global. Referencia canónica: `src/modules/clientes/`.

```
src/modules/<feature>/
├── <feature>.module.ts
├── controllers/
│   ├── <usecase>/<usecase>.controller.ts
│   ├── dto/int/          # DTOs de entrada (class-validator + Swagger)
│   ├── dto/out/          # DTOs de salida
│   └── mappers/          # Entity ↔ DTO
├── services/<usecase>/   # Un servicio por use-case (SRP)
├── repositories/         # Implementación Prisma
├── interfaces/           # Clase abstracta / token del repositorio
└── entities/             # Entidades de dominio ligeras
```

Registro del repositorio (token abstracto + implementación):

```typescript
{ provide: ClienteRepository, useClass: PrismaClienteRepository }
```

Tras crear un módulo nuevo: importarlo en `src/app.module.ts`.

### 3.2 Core transversal (no mover a features)

| Área | Ruta | Uso |
|------|------|-----|
| Envs | `src/core/config/envs.ts` | Variables tipadas; añadir aquí nuevas keys |
| Auth JWT | `src/core/config/auth.module/` | Global; importar en features que protegen rutas |
| Guard | `src/core/guards/jwt-auth.guard.ts` | `@UseGuards(JwtAuthGuard)` + `@ApiBearerAuth` |
| Filter | `src/core/exceptions/global-exception.filter.ts` | Ya global en `main.ts` |
| Interceptor | `src/core/interceptors/response.interceptor.ts` | Ya global en `AppModule` |
| Redis | `src/core/redis/` | `RedisModule` global; inyectar `RedisService` |
| Prisma app service | `src/core/database/prisma.service.ts` | Usado vía `PrismaModule` en raíz `prisma/` |
| Validators | `src/core/validators/` | Reutilizar en DTOs |

---

## 4. Convenciones de código (este repo)

1. **Idioma**: código y comentarios en español/inglés mezclado existente; nuevos mensajes de API y docs de dominio preferir **español** (coherente con Swagger actual).
2. **DTOs**: validar siempre con decoradores; el `ValidationPipe` global usa `whitelist: true` y `forbidNonWhitelisted: true`.
3. **Errores**: lanzar `HttpException` / excepciones Nest desde services; no tragar errores async.
4. **Auth en controllers**: prácticamente todos menos login van con `JwtAuthGuard`.
5. **Respuestas**: devolver datos (o `{ datos, mensaje }`); opcional `@ResponseMessage('...')`. El interceptor arma `ResponseGeneralDto`.
6. **Swagger**: `@ApiTags`, `@ApiOperation`, esquemas con `ResponseGeneralDto.swaggerSchema(...)`.
7. **Prisma**: flujo actual = esquema reflejado desde DB (`npm run prisma:generate:models` = `db pull` + `generate`). No hay carpeta `prisma/migrations/` formal; respetar ese flujo o introduce migraciones solo si se pide explícitamente.
8. **Inyección**: preferir constructor injection; tokens para interfaces de repositorio.
9. **No** crear “god services”; un service por use-case.
10. **No** duplicar providers globales (Prisma, Redis, Auth).
11. Typo histórico a preservar en config: variable JWT `SECRECT_KEY` (no renombrar sin migración de `.env`).
12. Campo DB tipográfico: `users.firts_names` (así en schema); no “corregir” sin migración real.

### 4.1 Endpoints existentes (resumen)

Base: `/api/v1/`

| Área | Rutas (relativas al prefijo) |
|------|------------------------------|
| Auth | `POST users/auth/login` |
| Users | `GET users/findbyid`, `findbyemail`; `PATCH users/update_users` |
| Clientes | CRUD + `gettiposidentity`, búsquedas por id/identity |
| Servicios | CRUD + tipos + por cliente |

Detalle exacto de paths: leer controllers respectivos o Swagger en runtime.

---

## 5. Estado real vs deuda conocida (validación)

### Implementado y usable

- Bootstrap Nest (CORS, pipes, filter, shutdown hooks, Swagger).
- CRUD clientes y servicios con repos Prisma + JWT.
- Login JWT + guard.
- Infra Docker Compose: Postgres (`5453→5432`), Redis (`6390`), API dev (`3050`), Redis Commander (profile `tools`).
- `RedisModule` / `RedisService` (set/get/del/remember/increment).
- Embed de README en build (`docs:build` → `src/core/docs/readme.generated.ts`).

### Huecos / riesgos (no asumir que existen)

| Ítem | Detalle |
|------|---------|
| `CreateUserController` | Archivo existe bajo users pero **no** está en `UsersModule.controllers` → create/active-inactive no expuestos |
| Cache en features | `RedisService` no inyectado aún en módulos de negocio |
| Menú/roles legacy | `PrismaMenuRepository` referencia funciones/schema `auth.*` no presentes en el schema Prisma actual |
| Tests | Sin `*.spec.ts` en `src/`; e2e plantilla en `test/` |
| Rate limiting / refresh token | No implementados |
| Compose producción API | `api-auth-jm` usa target Docker `development`, no `production` |
| README embebido previo | Contenido antiguo de otro producto posible; tras editar README ejecutar build |

Al generar código nuevo: **alinear con el patrón clientes/servicios**; no reintroducir schemas multi-tenant antiguos ni dependencias de menú SQL salvo que existan en DB.

---

## 6. Skills del proyecto (`.agents/`) — obligatorias

Antes de cambios sustanciales, los agentes deben aplicar estas skills:

| Skill | Ruta | Cuándo usarla |
|-------|------|----------------|
| **nestjs-best-practices** | `.agents/skills/nestjs-best-practices/SKILL.md` (+ reglas en `rules/`, compendio `AGENTS.md`) | Cualquier escritura/revisión Nest: módulos, DI, seguridad, errores, DB, API, performance |
| **commiter** | `.agents/skills/commiter/skill.md` | Solo cuando el usuario pida commit: Conventional Commits, header ≤50 chars, body obligatorio |
| **changelog-manager** | `.agents/skills/changelog-manager/skill.md` | Junto a commits: actualizar `CHANGELOG.md` Keep a Changelog bajo `[Unreleased]` con timestamp |
| **skill-creator** | `.agents/skills/skill-creator/SKILL.md` | Solo si se pide crear/mejorar skills |

### 6.1 Reglas NestJS prioritarias para este repo

Fuente: `.agents/skills/nestjs-best-practices/` (40 reglas). Priorizar al generar código:

1. **Architecture (CRITICAL):** feature modules; evitar ciclos (hay `forwardRef` Auth↔Users — no ampliar ciclos); SRP; repository pattern (ya usado); exports correctos.
2. **DI (CRITICAL):** constructor injection; tokens de interfaz; no service locator.
3. **Errors (HIGH):** HttpExceptions; filter global ya presente; async correcto.
4. **Security (HIGH):** JWT + guards; validar DTOs; considerar rate limiting en nuevos endpoints sensibles.
5. **Performance:** usar Redis/cache donde aporte; evitar N+1 en repos Prisma.
6. **Database:** transacciones en operaciones multi-paso; respetar flujo Prisma del proyecto.
7. **API:** DTOs int/out, interceptors, versionado (`api/v1/`).
8. **DevOps:** graceful shutdown ya habilitado; logging con utilidades de `core/config`; no hardcodear secretos.

Al dudar entre “atalajo” y regla del skill Nest: **ganar la regla del skill**.

### 6.2 Flujo de commit (si el usuario lo solicita)

1. Actualizar `CHANGELOG.md` con skill `changelog-manager`.
2. Commit con formato `commiter` (Conventional Commits).
3. No pushear ni forzar historial salvo petición explícita.
4. No commitear `.env` ni secretos.

---

## 7. Cómo extender (checklist para agentes)

1. Crear `src/modules/<feature>/` con la estructura de §3.1.
2. Interfaz de repositorio + `Prisma*Repository` usando `PrismaService`.
3. Services por use-case; controllers delgados (mappeo DTO ↔ entity).
4. Importar `AuthModule` y proteger con `JwtAuthGuard` salvo endpoints públicos justificados.
5. Registrar módulo en `AppModule`.
6. Si hay tablas nuevas en Postgres: aplicar SQL / init y regenerar Prisma (`prisma:generate:models` o `generate` según caso).
7. Documentar Swagger en el controller.
8. Si se usa caché: inyectar `RedisService` (módulo ya global).
9. Actualizar este `AGENTS.md` y `README.md` si cambia arquitectura, envs o flujos de arranque.
10. Ejecutar lint/tests relevantes cuando existan.

---

## 8. Configuración y runtime (resumen agentes)

Variables definidas en `src/core/config/envs.ts` (plantilla: `.env.example`):

- HTTP: `SERVER_PORT`, `HOST`
- Postgres: `DB_*`, `DATABASE_URL`, `POSTGRES_DATA_PATH` (bind volume compose)
- JWT: `DURATION_TOKEN`, `SECRECT_KEY`
- Redis: `REDIS_HOST`, `REDIS_PORT` (**6390** alineado con `redis/redis.conf`), `REDIS_PASSWORD`, DBs lógicas, TTL, paths, Commander

Compose sobrescribe `REDIS_HOST=redis-cache-jm` en el servicio API.

Puertos habituales:

| Servicio | Host |
|----------|------|
| API (compose) | 3050 |
| API (`.env.example` local) | 3001 |
| Postgres | 5453 |
| Redis | 6390 |
| Redis Commander | 8091 (profile `tools`) |

Scripts npm clave: `start:dev`, `build`, `start:prod`, `prisma:generate:models`, `docs:build`, `lint`, `test`.

Detalle operativo completo: **`README.md`**.

---

## 9. Principios de colaboración agente ↔ repo

- Preferir cambios mínimos y alineados al patrón existente.
- No refactorizar masivo ni “limpiar typo de envs/schema” sin pedido.
- No generar exploits, malware ni atacar sistemas.
- No inventar endpoints, tablas o skills no pedidas.
- Ante conflicto: código real del repo > este documento > supuestos genéricos Nest.
- Tras editar `README.md`, recordar que `prebuild` embebe su contenido.

---

## 10. Referencias rápidas de archivos

- Bootstrap: `src/main.ts`, `src/app.module.ts`
- Envs: `src/core/config/envs.ts`, `.env.example`
- Schema: `prisma/schema.prisma`
- Feature ejemplo: `src/modules/clientes/`
- Docker: `docker-compose.yml`, `dockerfile/api/Dockerfile`, `start_docker.sh`
- Skills Nest: `.agents/skills/nestjs-best-practices/SKILL.md`
