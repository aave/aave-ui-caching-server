import { ReserveIncentivesData } from '../graphql/object-types/incentives';
import { jsonParse } from '../helpers/utils';
import { getExpireDataInRedis, setExpireDataInRedis } from './shared';

export interface RedisPoolIncentivesData {
  data: ReserveIncentivesData[];
  hash: string;
}

export const setPoolIncentivesDataRedis = async (
  key: string,
  data: RedisPoolIncentivesData
): Promise<string | null> => setExpireDataInRedis(key, JSON.stringify(data));

export const getPoolIncentivesDataRedis = async (
  key: string
): Promise<RedisPoolIncentivesData | null> => {
  const protocolDataCachedStr = await getExpireDataInRedis(key);
  if (protocolDataCachedStr) {
    return jsonParse<RedisPoolIncentivesData>(protocolDataCachedStr);
  }

  return null;
};
