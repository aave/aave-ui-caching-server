import { RESERVES_LIST_VALIDITY_INTERVAL, CONFIG } from '../../config';
import { sleep } from '../../helpers/utils';
import { getProtocolData } from '../../services/pool-data';

interface ProtocolDataReserve {
  lendingPoolAddressProvider: string;
  reservesList: string[];
  timeOfReservesListFetch: number;
}

let protocolDataReserves: ProtocolDataReserve[] = [];

export const fetchAndAdd = async (lendingPoolAddressProvider: string) => {
  const reservesList: string[] = [];
  (await getProtocolData(lendingPoolAddressProvider)).reserves.forEach((reserve) => {
    reservesList.push(
      reserve.aTokenAddress,
      reserve.stableDebtTokenAddress,
      reserve.variableDebtTokenAddress
    );
  });

  add(lendingPoolAddressProvider, reservesList);

  return reservesList;
};

export const watch = async (lendingPoolAddressProvider: string) => {
  while (true) {
    try {
      // console.log('WATCHER - Fetching new reserves lists', lendingPoolAddressProvider);
      await fetchAndAdd(lendingPoolAddressProvider);
      // console.log('WATCHER - Fetched new reserves lists', {
      //   lendingPoolAddressProvider,
      //   reservesList,
      // });
      await sleep(RESERVES_LIST_VALIDITY_INTERVAL);
    } catch (error) {
      console.error(
        `${lendingPoolAddressProvider}: Reserves list loading failed with error`,
        error
      );
      await sleep(CONFIG.GENERAL_RESERVES_DATA_POOLING_INTERVAL);
    }
  }
};

export const get = (lendingPoolAddressProvider: string): string[] => {
  const reservesList = protocolDataReserves.find(
    (reserve) => reserve.lendingPoolAddressProvider === lendingPoolAddressProvider
  )?.reservesList;

  if (!reservesList?.length) {
    throw new Error(`reservesList for ${lendingPoolAddressProvider} is empty`);
  }
  return reservesList;
};

export const add = (lendingPoolAddressProvider: string, reservesList: string[]) => {
  protocolDataReserves = protocolDataReserves.filter(
    (reserve) => reserve.lendingPoolAddressProvider !== lendingPoolAddressProvider
  );
  protocolDataReserves.push({
    lendingPoolAddressProvider,
    reservesList,
    timeOfReservesListFetch: Date.now(),
  });
};
