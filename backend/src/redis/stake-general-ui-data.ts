import { StakeGeneralUIData } from '../graphql/object-types/stake-general-data';
import { jsonParse } from '../helpers/utils';
import { getExpireDataInRedis, setExpireDataInRedis } from './shared';

const KEY = 'stake-general-ui-data';

export const setStakeGeneralUIDataRedis = async (
  data: StakeGeneralUIData
): Promise<string | null> => setExpireDataInRedis(KEY, JSON.stringify(data));

export const getStakeGeneralUIDataRedis = async (): Promise<StakeGeneralUIData | null> => {
  const stakeUserDataCachedStr = await getExpireDataInRedis(KEY);
  if (stakeUserDataCachedStr) {
    return jsonParse<StakeGeneralUIData>(stakeUserDataCachedStr);
  }

  return null;
};
