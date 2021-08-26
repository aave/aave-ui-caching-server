import { PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES, USERS_DATA_POOLING_INTERVAL } from '../../config';
import { runTask } from '../task-helpers';
import { handler, running, startUp } from './handler';

PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES.forEach((poolAddress) => {
  updatUsersData(poolAddress);
});

async function updatUsersData(poolAddress: string, poolingInterval = USERS_DATA_POOLING_INTERVAL) {
  console.log(
    `updateUserData job starting up for pool ${poolAddress} poolingInterval ${
      poolingInterval / 1000
    }s`
  );

  await runTask({
    runEvery: poolingInterval,
    startupHandler: () => startUp(poolAddress),
    mainHandler: () => handler(poolAddress),
    runningHandler: running,
  });
}
