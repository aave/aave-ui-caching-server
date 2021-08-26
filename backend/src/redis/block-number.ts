import { getExpireDataInRedis, setExpireDataInRedis } from './shared';

const BLOCK_NUMBER_REDIS_KEY = 'BLOCK_NUMBER';

export const getBlockNumberRedis = async (): Promise<string | null> =>
  await getExpireDataInRedis(BLOCK_NUMBER_REDIS_KEY);

export const setBlockNumberRedis = async (blockNumber: number): Promise<string | null> =>
  await setExpireDataInRedis(BLOCK_NUMBER_REDIS_KEY, blockNumber.toString(10), 20);
