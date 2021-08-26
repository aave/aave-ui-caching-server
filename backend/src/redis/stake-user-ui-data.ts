import { StakeUserUIData } from '../graphql/object-types/stake-user-data';
import { jsonParse } from '../helpers/utils';
import { getExpireDataInRedis, setExpireDataInRedis } from './shared';

const buildKey = (userAddress: string) => `stake-user-ui-data:${userAddress}`;

export const setStakeUserUIDataRedis = async (
  userAddress: string,
  data: StakeUserUIData
): Promise<string> => setExpireDataInRedis(buildKey(userAddress), JSON.stringify(data));

export const getStakeUserUIDataRedis = async (
  userAddress: string
): Promise<StakeUserUIData | null> => {
  const stakeUserDataCachedStr = await getExpireDataInRedis(buildKey(userAddress));
  if (stakeUserDataCachedStr) {
    return jsonParse<StakeUserUIData>(stakeUserDataCachedStr);
  }

  return null;
};
