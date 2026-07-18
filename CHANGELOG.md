# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- [17/07/2026 15:04:30] Make IFC persist idempotent (reuse existing agrupaciones/elementos/psets/cantidades) and safely read type property sets without web-ifc `HasPropertySets is not iterable`

### Changed

- [17/07/2026 22:23:10] Add `elementsDB` field to `IfcProcessedData` interface (defaulted to null in processing results)
- [17/07/2026 15:04:30] Add Prisma indexes on `agrupacion_ifc.modelo_id`, `elemento_ifc.modelo_id`, `property_set.elemento_id`; drop unused `modelo_ifc.nombre_archivo` index
- [17/07/2026 00:04:59] Reflect IFC domain tables in Prisma schema (`modelo_ifc`, `agrupacion_ifc`, `elemento_ifc`, `property_set`, `propiedad_parametro`, `cantidad_ifc`)
- [15/07/2026 20:36:04] Replace open CORS with explicit origins and add CORS headers on `/storage` for cross-origin IFC fetches
- [15/07/2026 16:32:43] Raise Express body parser limit via BODY_LIMIT env and align .env.example SERVER_PORT with Docker API (3050)

### Added

- [17/07/2026 22:23:10] Expose grouped IFC elements from DB in process-ifc: repository methods calling `get_elementbynivel`/`get_elementbycategory`, aggregated as `{ nivel, categoria }` into `elementsDB` on the processing result
- [17/07/2026 00:04:59] Add IFC processing pipeline (`IfcProcessingService`) that parses stored IFC files with web-ifc and persists modelo, agrupaciones, elementos, property sets, propiedades/parámetros and cantidades físicas
- [17/07/2026 00:04:59] Add Prisma-backed repositories/modules for `modelo_ifc`, `agrupacion_ifc`, `elemento_ifc`, `property_set`, `propiedad_parametro` and `cantidad_ifc`
- [17/07/2026 00:04:59] Extend process-ifc API/controller to trigger IFC parse-and-persist after upload/listing flows
- [15/07/2026 20:36:04] Add `GET process-ifc/getFileIfcAll` to list IFC files from `ref_files` with public `/storage` URLs for 3D viewers
- [15/07/2026 20:36:04] Persist uploaded IFC metadata in Prisma model `ref_files` via repository/entity/mapper pattern
- [15/07/2026 20:36:04] Serve `src/storage` as static assets at `/storage` and configure `CORS_ORIGINS` for Angular frontend access
- [15/07/2026 16:32:43] Add AdminFile core module and process-ifc endpoint to persist IFC/base64 uploads under src/storage, with configurable BODY_LIMIT for large JSON payloads
- [14/07/2026 20:40:20] Initial NestJS backend with JWT auth, Prisma/PostgreSQL, Redis, and feature modules for users, clients, and services
- [14/07/2026 20:40:20] Docker Compose stack (Postgres, Redis, API) with agent/developer docs (AGENTS.md, README.md) and project skills under .agents/

### Removed

- [17/07/2026 22:23:10] Remove `clientes` and `servicios` feature modules (controllers, services, repositories, DTOs, entities, mappers, interfaces) and unregister them from `AppModule`, narrowing the backend scope to the IFC pipeline
