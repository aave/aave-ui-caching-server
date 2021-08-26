import { StakeGeneralUIData } from '../../graphql/object-types/stake-general-data';
import { StakeUserUIData } from '../../graphql/object-types/stake-user-data';
import {
  getStakeGeneralUIDataRedis,
  getStakeUserUIDataRedis,
  setStakeGeneralUIDataRedis,
  setStakeUserUIDataRedis,
} from '../../redis';
import { getGeneralStakeUIDataRPC, getUserStakeUIDataRPC } from './rpc';

/**
 * Get the stake user data
 * @param userAddress The user address
 * @param forceCache If you should force the cache
 */
export async function getStakeUserUIData(
  userAddress: string,
  forceCache = false
): Promise<StakeUserUIData> {
  if (!forceCache) {
    try {
      const stakeUserUIData = await getStakeUserUIDataRedis(userAddress);
      if (stakeUserUIData) {
        return stakeUserUIData;
      }
    } catch (error) {
      console.log('Error `getStakeUserUIDataRedis`', { error, userAddress });
    }
  }

  const stakeUserUIData = await getUserStakeUIDataRPC(userAddress);
  try {
    await setStakeUserUIDataRedis(userAddress, stakeUserUIData);
  } catch (error) {
    console.log('Error `setStakeUserUIDataRedis`', { error, userAddress });
  }
  return stakeUserUIData;
}

/**
 * Get the stake general data
 * @param forceCache If you should force the cache
 */
export async function getStakeGeneralUIData(forceCache = false): Promise<StakeGeneralUIData> {
  if (!forceCache) {
    try {
      const stakeGeneralUIData = await getStakeGeneralUIDataRedis();
      if (stakeGeneralUIData) {
        return stakeGeneralUIData;
      }
    } catch (error) {
      console.log('Error `getStakeGeneralUIDataRedis`', { error });
    }
  }

  const stakeGeneralUIData = await getGeneralStakeUIDataRPC();
  try {
    await setStakeGeneralUIDataRedis(stakeGeneralUIData);
  } catch (error) {
    console.log('Error `setStakeGeneralUIDataRedis`', { error });
  }
  return stakeGeneralUIData;
}
