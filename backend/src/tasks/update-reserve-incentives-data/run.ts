import { Denominations } from '@aave/contract-helpers';
import { CONFIG } from '../../config';
import { runTask } from '../task-helpers';
import { handler, running, startUp } from './handler';

CONFIG.PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES.forEach((lendingPoolAddressProvider) =>
  updateReservesIncentivesData(lendingPoolAddressProvider)
);

async function updateReservesIncentivesData(
  lendingPoolAddressProvider: string,
  poolingInterval = CONFIG.RESERVE_INCENTIVES_DATA_POOLING_INTERVAL
) {
  console.log(
    `updateReservesIncentivesData job starting up with poolingInterval ${
      poolingInterval / 1000
    }s for pool address ${lendingPoolAddressProvider}`
  );

  await runTask({
    runEvery: poolingInterval,
    startupHandler: () => startUp(lendingPoolAddressProvider),
    mainHandler: () =>
      handler({
        lendingPoolAddressProvider,
        chainlinkFeedsRegistry: CONFIG.CHAINLINK_FEEDS_REGISTRY,
        quote: Denominations[CONFIG.CHAINLINK_FEED_QUOTE],
      }),
    runningHandler: running,
  });
}
