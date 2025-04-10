// src/infra/cache/redis-cache.module.ts
import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Global()
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'user_management_cache', // name of the redis container
      port: 6379,
      ttl: 60 * 5, // default TTL 5 minutes
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
