import {
  USER_INCENTIVES_DATA_POOLING_INTERVAL,
  PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES,
} from '../../config';
import { runTask } from '../task-helpers';
import { handler, running, startUp } from './handler';

PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES.forEach((lendingPoolAddressProvider) =>
  updateUsersIncentivesData(lendingPoolAddressProvider)
);

async function updateUsersIncentivesData(
  lendingPoolAddressProvider: string,
  poolingInterval = USER_INCENTIVES_DATA_POOLING_INTERVAL
) {
  console.log(
    `updateUserIncentivesData job starting up with poolingInterval ${
      poolingInterval / 1000
    }s for pool address ${lendingPoolAddressProvider}`
  );

  await runTask({
    runEvery: poolingInterval,
    startupHandler: () => startUp(lendingPoolAddressProvider),
    mainHandler: () => handler(lendingPoolAddressProvider),
    runningHandler: running,
  });
}
