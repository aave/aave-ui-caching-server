import { ProtocolData } from '../graphql/object-types/reserve';
import { jsonParse } from '../helpers/utils';
import { getExpireDataInRedis, setExpireDataInRedis } from './shared';

interface RedisProtcolPoolData {
  data: ProtocolData;
  hash: string;
}

export const setProtocolDataRedis = async (
  poolAddress: string,
  data: RedisProtcolPoolData
): Promise<string | null> => setExpireDataInRedis(poolAddress, JSON.stringify(data));

export const getProtocolDataRedis = async (
  poolAddress: string
): Promise<RedisProtcolPoolData | null> => {
  const protocolDataCachedStr = await getExpireDataInRedis(poolAddress);
  if (protocolDataCachedStr) {
    return jsonParse<RedisProtcolPoolData>(protocolDataCachedStr);
  }

  return null;
};
