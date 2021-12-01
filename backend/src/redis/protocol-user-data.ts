import { UserReserveData } from '../graphql/object-types/user-reserve';
import { jsonParse } from '../helpers/utils';
import { getExpireDataInRedis, setExpireDataInRedis } from './shared';

export const setProtocolUserDataRedis = async (
  poolAddress: string,
  userAddress: string,
  data: UserReserveData[]
) => setExpireDataInRedis(`${poolAddress}${userAddress}`, JSON.stringify(data));

export const getProtocolUserDataRedis = async (
  poolAddress: string,
  userAddress: string
): Promise<UserReserveData[] | null> => {
  const userDataCachedStr = await getExpireDataInRedis(`${poolAddress}${userAddress}`);

  if (userDataCachedStr) {
    return jsonParse<UserReserveData[]>(userDataCachedStr);
  }

  return null;
};
