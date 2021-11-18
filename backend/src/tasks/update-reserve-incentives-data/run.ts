import { Denominations } from '@aave/contract-helpers';
import {
  RESERVE_INCENTIVES_DATA_POOLING_INTERVAL,
  PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES,
  CHAINLINK_FEEDS_REGISTRY,
  CHAINLINK_FEED_QUOTE,
} from '../../config';
import { runTask } from '../task-helpers';
import { handler, running, startUp } from './handler';

PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES.forEach((lendingPoolAddressProvider) =>
  updateReservesIncentivesData(lendingPoolAddressProvider)
);

async function updateReservesIncentivesData(
  lendingPoolAddressProvider: string,
  poolingInterval = RESERVE_INCENTIVES_DATA_POOLING_INTERVAL
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
        chainlinkFeedsRegistry: CHAINLINK_FEEDS_REGISTRY,
        quote: Denominations[CHAINLINK_FEED_QUOTE],
      }),
    runningHandler: running,
  });
}
