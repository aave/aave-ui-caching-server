import { getPoolIncentivesRPC, getUserPoolIncentivesRPC } from '.';
import { ReserveIncentivesData } from '../../graphql/object-types/incentives';
import { UserIncentivesData } from '../../graphql/object-types/user-incentives';
import { createHash } from '../../helpers/utils';
import {
  getPoolIncentivesDataRedis,
  setPoolIncentivesDataRedis,
  getPoolIncentivesUserDataRedis,
  setPoolIncentivesUserDataRedis,
} from '../../redis';

export const getPoolIncentives = async (
  lendingPoolAddressProvider: string
): Promise<ReserveIncentivesData[]> => {
  const incentivesKey = `incentives-${lendingPoolAddressProvider}`;
  try {
    const poolIncentives = await getPoolIncentivesDataRedis(incentivesKey);
    if (poolIncentives) {
      return poolIncentives.data;
    }
  } catch (error) {
    console.log('Error `getPoolIncentivesDataRedis`', { error, lendingPoolAddressProvider });
  }

  const incentivesData: ReserveIncentivesData[] = await getPoolIncentivesRPC(
    lendingPoolAddressProvider
  );
  try {
    await setPoolIncentivesDataRedis(incentivesKey, {
      data: incentivesData,
      hash: createHash(incentivesData),
    });
  } catch (error) {
    console.log('Error `setPoolIncentivesDataRedis`', { error, lendingPoolAddressProvider });
  }

  return incentivesData;
};

export const getUserPoolIncentives = async (
  lendingPoolAddressProvider: string,
  userAddress: string,
  cacheFirst = true
): Promise<UserIncentivesData[]> => {
  const incentivesKey = `incentives-${lendingPoolAddressProvider}`;
  if (cacheFirst) {
    try {
      const userIncentives: UserIncentivesData[] | null = await getPoolIncentivesUserDataRedis(
        incentivesKey,
        userAddress
      );
      if (userIncentives) {
        return userIncentives;
      }
    } catch (error) {
      console.log('Error `getPoolIncentivesUserData`', {
        error,
        lendingPoolAddressProvider,
        userAddress,
        cacheFirst,
      });
    }
  }
  const userIncentives: UserIncentivesData[] = await getUserPoolIncentivesRPC(
    lendingPoolAddressProvider,
    userAddress
  );

  try {
    await setPoolIncentivesUserDataRedis(incentivesKey, userAddress, userIncentives);
  } catch (error) {
    console.log('Error `setUserIncentivesDataRedis`', {
      error,
      lendingPoolAddressProvider,
      userAddress,
      cacheFirst,
    });
  }

  return userIncentives;
};
