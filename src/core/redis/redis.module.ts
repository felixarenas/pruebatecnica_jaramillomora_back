// redis/redis.module.ts
import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisService } from './redis.service';
import { envs } from '../config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: envs.REDIS_HOST || 'redis-cache-jm',
            port: envs.REDIS_PORT || 6390,
          },
          password: envs.REDIS_PASSWORD || 'redis123',
          database: envs.REDIS_CACHE_DB || 2,
          ttl: envs.REDIS_TTL || 86400, // 24 hours
          pingInterval: 10000,
        });

        return {
          store,
          // Configuración global
          ttl: envs.REDIS_TTL || 86400, // 24 hours
          max: envs.REDIS_MAX_ITEMS || 1000, // Maximum 1000 items in cache
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService, CacheModule],
})
export class RedisModule { }