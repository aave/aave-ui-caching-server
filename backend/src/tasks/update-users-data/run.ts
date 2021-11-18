import { CONFIG } from '../../config';
import { runTask } from '../task-helpers';
import { handler, running, startUp } from './handler';

CONFIG.PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES.forEach((lendingPoolAddressProvider) => {
  updatUsersData(lendingPoolAddressProvider);
});

async function updatUsersData(
  lendingPoolAddressProvider: string,
  poolingInterval = CONFIG.USERS_DATA_POOLING_INTERVAL
) {
  console.log(
    `updateUserData job starting up for pool ${lendingPoolAddressProvider} poolingInterval ${
      poolingInterval / 1000
    }s`
  );

  await runTask({
    runEvery: poolingInterval,
    startupHandler: () => startUp(lendingPoolAddressProvider),
    mainHandler: () => handler(lendingPoolAddressProvider),
    runningHandler: running,
  });
}
