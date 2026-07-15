// redis/redis.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // Guardar en caché con TTL personalizado
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  // Obtener de caché
  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  // Eliminar de caché
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  // Resetear toda la caché (cuidado)
  async reset(): Promise<void> {
    await this.cacheManager.clear();
  }

  // Obtener o guardar (patrón estándar)
  async remember<T>(
    key: string,
    ttl: number,
    callback: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) {
      return cached;
    }

    const fresh = await callback();
    await this.set(key, fresh, ttl);
    return fresh;
  }

  // Incrementar contador (útil para rate limiting)
  async increment(key: string): Promise<number> {
    const current = (await this.get<number>(key)) || 0;
    const newValue = current + 1;
    await this.set(key, newValue);
    return newValue;
  }

  // Verificar si existe
  async exists(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== undefined && value !== null;
  }
}