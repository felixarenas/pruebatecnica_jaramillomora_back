# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- [15/07/2026 16:32:43] Add AdminFile core module and process-ifc endpoint to persist IFC/base64 uploads under src/storage, with configurable BODY_LIMIT for large JSON payloads
- [14/07/2026 20:40:20] Initial NestJS backend with JWT auth, Prisma/PostgreSQL, Redis, and feature modules for users, clients, and services
- [14/07/2026 20:40:20] Docker Compose stack (Postgres, Redis, API) with agent/developer docs (AGENTS.md, README.md) and project skills under .agents/

### Changed

- [15/07/2026 16:32:43] Raise Express body parser limit via BODY_LIMIT env and align .env.example SERVER_PORT with Docker API (3050)
