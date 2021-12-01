import { UserIncentivesData } from '../graphql/object-types/user-incentives';
import { jsonParse } from '../helpers/utils';
import { getExpireDataInRedis, setExpireDataInRedis } from './shared';

export const setPoolIncentivesUserDataRedis = async (
  key: string,
  userAddress: string,
  data: UserIncentivesData[]
) => setExpireDataInRedis(`${key}${userAddress}`, JSON.stringify(data));

export const getPoolIncentivesUserDataRedis = async (
  key: string,
  userAddress: string
): Promise<UserIncentivesData[] | null> => {
  const userIncentivesDataCachedStr = await getExpireDataInRedis(`${key}${userAddress}`);

  if (userIncentivesDataCachedStr) {
    return jsonParse<UserIncentivesData[]>(userIncentivesDataCachedStr);
  }

  return null;
};
