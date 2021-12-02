import { UserReservesData } from '../graphql/object-types/user-reserve';
import { jsonParse } from '../helpers/utils';
import { getExpireDataInRedis, setExpireDataInRedis } from './shared';

export const setProtocolUserDataRedis = async (
  poolAddress: string,
  userAddress: string,
  data: UserReservesData
) => setExpireDataInRedis(`${poolAddress}${userAddress}`, JSON.stringify(data));

export const getProtocolUserDataRedis = async (
  poolAddress: string,
  userAddress: string
): Promise<UserReservesData | null> => {
  const userDataCachedStr = await getExpireDataInRedis(`${poolAddress}${userAddress}`);

  if (userDataCachedStr) {
    return jsonParse<UserReservesData>(userDataCachedStr);
  }

  return null;
};
