import { CONFIG } from '../../config';
import { runTask } from '../task-helpers';
import { handler, running, startUp } from './handler';

async function updateBlockNumber(poolingInterval = CONFIG.BLOCK_NUMBER_POOLING_INTERVAL) {
  console.log(`UpdateBlockNumber job starting up with poolingInterval ${poolingInterval / 1000}s`);

  await runTask({
    runEvery: poolingInterval,
    startupHandler: startUp,
    mainHandler: handler,
    runningHandler: running,
  });
}

updateBlockNumber();
