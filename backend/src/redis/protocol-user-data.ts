import { UserData } from '../graphql/object-types/user-reserve';
import { jsonParse } from '../helpers/utils';
import { getExpireDataInRedis, setExpireDataInRedis } from './shared';

export const setProtocolUserDataRedis = async (
  poolAddress: string,
  userAddress: string,
  data: UserData
) => setExpireDataInRedis(`${poolAddress}${userAddress}`, JSON.stringify(data));

export const getProtocolUserDataRedis = async (
  poolAddress: string,
  userAddress: string
): Promise<UserData | null> => {
  const userDataCachedStr = await getExpireDataInRedis(`${poolAddress}${userAddress}`);

  if (userDataCachedStr) {
    return jsonParse<UserData>(userDataCachedStr);
  }

  return null;
};
