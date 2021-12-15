import { ProtocolData } from '../../graphql/object-types/reserve';
import { UserReservesData } from '../../graphql/object-types/user-reserve';
import { createHash } from '../../helpers/utils';
import {
  getProtocolDataRedis,
  getProtocolUserDataRedis,
  setProtocolDataRedis,
  setProtocolUserDataRedis,
} from '../../redis';
import { getProtocolDataRPC, getProtocolUserDataRPC } from './rpc';

/**
 * Get the protocol data for a pool
 * @param lendingPoolAddressProvider The pool address
 */
export async function getProtocolData(lendingPoolAddressProvider: string): Promise<ProtocolData> {
  try {
    const protocolData = await getProtocolDataRedis(lendingPoolAddressProvider);
    if (protocolData) {
      return protocolData.data;
    }
  } catch (error) {
    console.log('Error `getProtocolDataRedis`', { error, lendingPoolAddressProvider });
  }

  const protocolData = await getProtocolDataRPC(lendingPoolAddressProvider);
  try {
    await setProtocolDataRedis(lendingPoolAddressProvider, {
      data: protocolData,
      hash: createHash(protocolData),
    });
  } catch (error) {
    console.log('Error `setProtocolDataRedis`', { error, lendingPoolAddressProvider });
  }

  return protocolData;
}

/**
 * Get the user data
 * @param lendingPoolAddressProvider The pool address
 * @param userAddress The user address
 * @param cacheFirst check the cache first
 */
export async function getProtocolUserData(
  lendingPoolAddressProvider: string,
  userAddress: string,
  cacheFirst = true
): Promise<UserReservesData> {
  if (cacheFirst) {
    try {
      const userReserves = await getProtocolUserDataRedis(lendingPoolAddressProvider, userAddress);
      if (userReserves) {
        return userReserves;
      }
    } catch (error) {
      console.log('Error `getProtocolUserData`', {
        error,
        lendingPoolAddressProvider,
        userAddress,
        cacheFirst,
      });
    }
  }

  const userReserves: UserReservesData = await getProtocolUserDataRPC(
    lendingPoolAddressProvider,
    userAddress
  );
  try {
    await setProtocolUserDataRedis(lendingPoolAddressProvider, userAddress, userReserves);
  } catch (error) {
    console.log('Error `setUserDataRedis`', {
      error,
      lendingPoolAddressProvider,
      userAddress,
      cacheFirst,
    });
  }

  return userReserves;
}
