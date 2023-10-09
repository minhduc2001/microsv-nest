import { envService } from '@libs/env';
import { LoggerService } from '@libs/logger';
import { Injectable, OnModuleInit } from '@nestjs/common';

import Redis from 'ioredis';

@Injectable()
export class CacheService {
  client: Redis;
  private logger;
  constructor(private readonly loggerService: LoggerService) {
    this.logger = this.loggerService.getLogger(CacheService.name);
    this.client = new Redis({
      host: envService.REDIS_HOST,
      port: envService.REDIS_PORT,
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis error: ', err);
    });
  }

  async get(key: string): Promise<string> {
    return JSON.parse(await this.client.get(key));
  }

  async set(key: string, value: string) {
    return this.client.set(key, value);
  }

  async setWithExpiration(key: string, value: any, seconds: number) {
    return this.client.set(key, JSON.stringify(value), 'EX', seconds);
  }

  async del(key: string) {
    return this.client.del(key);
  }

  getClient() {
    return this.client;
  }
}
