import { setBlockNumberRedis } from '../../redis';
import * as lastSeenBlockState from '../last-seen-block.state';
import { getBlockContext } from '../task-helpers';

const STATE_KEY = 'update-block-number';
let _running = false;
export const running = () => _running;

export const handler = async () => {
  try {
    const blockContext = await getBlockContext(STATE_KEY, false);
    if (blockContext.shouldExecute) {
      await setBlockNumberRedis(blockContext.currentBlock);
      blockContext.commit();
      console.log(`Block number in cache set: ${blockContext.currentBlock}`);
    }
  } catch (e) {
    console.error('Get block number task was failed with error:', e);
  }
};

export const startUp = () => {
  _running = true;
  console.log('UpdateBlockNumber job started up successfully');
};

export const stopHandler = () => {
  lastSeenBlockState.remove(STATE_KEY);
  _running = false;
  console.log('UpdateBlockNumber job stopped successfully');
};
