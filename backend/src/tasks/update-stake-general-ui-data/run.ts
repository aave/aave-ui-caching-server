import { STAKING_CONFIG } from '../../config';
import { isStakeEnabled, runTask } from '../task-helpers';
import { handler, running, startUp } from './handler';

export async function updateStakeGeneralUIData(poolingInterval = 1) {
  if (isStakeEnabled()) {
    console.log(
      `updateStakeGeneralUIData job starting up with poolingInterval ${poolingInterval / 1000}s`
    );

    await runTask({
      runEvery: poolingInterval,
      startupHandler: startUp,
      mainHandler: handler,
      runningHandler: running,
    });
  } else {
    console.log('updateStakeGeneralUIData job not enabled for this network');
  }
}

updateStakeGeneralUIData(STAKING_CONFIG.STAKE_DATA_POOLING_INTERVAL);
