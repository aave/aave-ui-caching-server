import {
  GENERAL_RESERVES_DATA_POOLING_INTERVAL,
  PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES,
} from '../../config';
import { runTask } from '../task-helpers';
import { handler, running, startUp } from './handler';

PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES.forEach((poolAddress) =>
  updateGeneralReservesData(poolAddress)
);

async function updateGeneralReservesData(
  poolAddress: string,
  poolingInterval = GENERAL_RESERVES_DATA_POOLING_INTERVAL
) {
  console.log(
    `updateGeneralReservesData job starting up with poolingInterval ${
      poolingInterval / 1000
    }s for pool address ${poolAddress}`
  );

  await runTask({
    runEvery: poolingInterval,
    startupHandler: startUp,
    mainHandler: () => handler(poolAddress),
    runningHandler: running,
  });
}
