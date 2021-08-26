import { ProtocolData } from '../../graphql/object-types/reserve';
import { UserData } from '../../graphql/object-types/user-reserve';
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
 * @param poolAddress The pool address
 */
export async function getProtocolData(poolAddress: string): Promise<ProtocolData> {
  try {
    const protocolData = await getProtocolDataRedis(poolAddress);
    if (protocolData) {
      return protocolData.data;
    }
  } catch (error) {
    console.log('Error `getProtocolDataRedis`', { error, poolAddress });
  }

  const protocolData = await getProtocolDataRPC(poolAddress);
  try {
    await setProtocolDataRedis(poolAddress, {
      data: protocolData,
      hash: createHash(protocolData),
    });
  } catch (error) {
    console.log('Error `setProtocolDataRedis`', { error, poolAddress });
  }

  return protocolData;
}

/**
 * Get the user data
 * @param poolAddress The pool address
 * @param userAddress The user address
 * @param cacheFirst check the cache first
 */
export async function getProtocolUserData(
  poolAddress: string,
  userAddress: string,
  cacheFirst = true
): Promise<UserData> {
  if (cacheFirst) {
    try {
      const userData = await getProtocolUserDataRedis(poolAddress, userAddress);
      if (userData) {
        return userData;
      }
    } catch (error) {
      console.log('Error `getProtocolUserData`', { error, poolAddress, userAddress, cacheFirst });
    }
  }

  const userData = await getProtocolUserDataRPC(poolAddress, userAddress);
  try {
    await setProtocolUserDataRedis(poolAddress, userAddress, userData);
  } catch (error) {
    console.log('Error `setUserDataRedis`', { error, poolAddress, userAddress, cacheFirst });
  }

  return userData;
}
