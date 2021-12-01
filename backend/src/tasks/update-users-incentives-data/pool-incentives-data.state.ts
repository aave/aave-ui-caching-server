import { CONFIG, RESERVES_LIST_VALIDITY_INTERVAL } from '../../config';
import { ReserveIncentivesData } from '../../graphql/object-types/incentives';
import { sleep } from '../../helpers/utils';
import { getPoolIncentives } from '../../services/incentives-data';

interface PoolIncentivesData {
  poolAddress: string;
  reservesList: string[];
  timeOfReservesListFetch: number;
}

let protocolDataReserves: PoolIncentivesData[] = [];

export const fetchAndAdd = async (poolAddress: string) => {
  const poolIncentives: ReserveIncentivesData[] = await getPoolIncentives({
    lendingPoolAddressProvider: poolAddress,
  });
  const tokenAddresses: Set<string> = new Set();

  poolIncentives.forEach((reserve) => {
    reserve.aIncentiveData.rewardsTokenInformation.map((rewardInfo) => {
      if (rewardInfo.emissionEndTimestamp !== 0) {
        tokenAddresses.add(reserve.aIncentiveData.tokenAddress);
      }
    });
    reserve.sIncentiveData.rewardsTokenInformation.map((rewardInfo) => {
      if (rewardInfo.emissionEndTimestamp !== 0) {
        tokenAddresses.add(reserve.sIncentiveData.tokenAddress);
      }
    });
    reserve.vIncentiveData.rewardsTokenInformation.map((rewardInfo) => {
      if (rewardInfo.emissionEndTimestamp !== 0) {
        tokenAddresses.add(reserve.vIncentiveData.tokenAddress);
      }
    });
  });

  const reservesList: string[] = Array.from(tokenAddresses);

  add(poolAddress, reservesList);

  return reservesList;
};

export const watch = async (poolAddress: string) => {
  while (true) {
    try {
      console.log('WATCHER - Fetching new reserves lists', poolAddress);
      const reservesList = await fetchAndAdd(poolAddress);
      console.log('WATCHER - Fetched new reserves lists', { poolAddress, reservesList });
      await sleep(RESERVES_LIST_VALIDITY_INTERVAL);
    } catch (error) {
      console.error(`${poolAddress}: Reserves list loading failed with error`, error);
      await sleep(CONFIG.GENERAL_RESERVES_DATA_POOLING_INTERVAL);
    }
  }
};

export const get = (poolAddress: string): string[] => {
  console.log('pool address: ', poolAddress);
  console.log('protocl data reserves::: ', protocolDataReserves);

  const reservesList = protocolDataReserves.find(
    (reserve) => reserve.poolAddress === poolAddress
  )?.reservesList;

  if (!reservesList?.length) {
    return [];
    // throw new Error(`reservesList for ${poolAddress} is empty`);
  }
  return reservesList;
};

export const add = (poolAddress: string, reservesList: string[]) => {
  protocolDataReserves = protocolDataReserves.filter(
    (reserve) => reserve.poolAddress !== poolAddress
  );
  protocolDataReserves.push({ poolAddress, reservesList, timeOfReservesListFetch: Date.now() });
};
