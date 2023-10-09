import { DynamicModule, Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule as CacheManager } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
