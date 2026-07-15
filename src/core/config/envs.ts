import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });
import { from, logger } from 'env-var'

const env = from(process.env, {}, logger)

export const envs = {
    SERVER_PORT: env.get('SERVER_PORT').default('').asPortNumber(),
    HOST: env.get('HOST').default('').asString(),
    DB_HOST: env.get('DB_HOST').default('').asString(),
    DB_DATABASE: env.get('DB_DATABASE').default('').asString(),
    DB_USER: env.get('DB_USER').default('').asString(),
    DB_PASSWORD: env.get('DB_PASSWORD').default('').asString(),
    DB_PORT: env.get('DB_PORT').default('').asPortNumber(),
    DATABASE_URL: env.get('DATABASE_URL').default('').asString(),
    DURATION_TOKEN: env.get('DURATION_TOKEN').default('15d').asString(),
    SECRECT_KEY: env.get('SECRECT_KEY').default('').asString(),
    REDIS_HOST: env.get('REDIS_HOST').default('localhost').asString(),
    REDIS_HOST_DOCKER: env.get('REDIS_HOST_DOCKER').default('redis-cache').asString(),
    REDIS_PORT: env.get('REDIS_PORT').default('').asPortNumber(),
    REDIS_PASSWORD: env.get('REDIS_PASSWORD').default('').asString(),
    REDIS_DB: env.get('REDIS_DB').default('0').asInt(),
    REDIS_SESSION_DB: env.get('REDIS_SESSION_DB').default('1').asInt(),
    REDIS_CACHE_DB: env.get('REDIS_CACHE_DB').default('2').asInt(),
    REDIS_MAXMEMORY: env.get('REDIS_MAXMEMORY').default('256mb').asString(),
    REDIS_MEMORY_LIMIT: env.get('REDIS_MEMORY_LIMIT').default('512M').asString(),
    REDIS_MEMORY_RESERVATION: env.get('REDIS_MEMORY_RESERVATION').default('256M').asString(),
    REDIS_DATA_PATH: env.get('REDIS_DATA_PATH').default('./redis/data').asString(),
    REDIS_LOGS_PATH: env.get('REDIS_LOGS_PATH').default('./redis/logs').asString(),
    REDIS_COMMANDER_PORT: env.get('REDIS_COMMANDER_PORT').default('8081').asPortNumber(),
    REDIS_TTL: env.get('REDIS_TTL').default('86400').asInt(),
    REDIS_MAX_ITEMS: env.get('REDIS_MAX_ITEMS').default('1000').asInt(),
}