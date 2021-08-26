import { RECOVERY_TIMEOUT, RESERVES_LIST_VALIDITY_INTERVAL } from '../../config';
import { sleep } from '../../helpers/utils';
import { getProtocolData } from '../../services/pool-data';

interface ProtocolDataReserve {
  poolAddress: string;
  reservesList: string[];
  timeOfReservesListFetch: number;
}

let protocolDataReserves: ProtocolDataReserve[] = [];

export const fetchAndAdd = async (poolAddress: string) => {
  const reservesList: string[] = [];
  (await getProtocolData(poolAddress)).reserves.forEach((reserve) => {
    reservesList.push(
      reserve.aTokenAddress,
      reserve.stableDebtTokenAddress,
      reserve.variableDebtTokenAddress
    );
  });

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
      await sleep(RECOVERY_TIMEOUT);
    }
  }
};

export const get = (poolAddress: string): string[] => {
  const reservesList = protocolDataReserves.find(
    (reserve) => reserve.poolAddress === poolAddress
  )?.reservesList;

  if (!reservesList?.length) {
    throw new Error(`reservesList for ${poolAddress} is empty`);
  }
  return reservesList;
};

export const add = (poolAddress: string, reservesList: string[]) => {
  protocolDataReserves = protocolDataReserves.filter(
    (reserve) => reserve.poolAddress !== poolAddress
  );
  protocolDataReserves.push({ poolAddress, reservesList, timeOfReservesListFetch: Date.now() });
};
