import Redis from 'ioredis';
import { REDIS_HOST } from '../config';

export const getRedis = () =>
  new Redis({
    host: REDIS_HOST || 'redis',
    retryStrategy(times): number {
      return Math.max(times * 100, 3000);
    },
  });

const cacheRedis = getRedis();

export const setExpireDataInRedis = async (
  key: string,
  value: string,
  seconds = 60
): Promise<string | null> => {
  return await cacheRedis.set(key, value, 'EX', seconds);
};

export const getExpireDataInRedis = async (key: string): Promise<string | null> =>
  cacheRedis.get(key);
