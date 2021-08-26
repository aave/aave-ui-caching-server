import { createHash } from '../../helpers/utils';
import { pushUpdatedStakeGeneralUIDataToSubscriptions } from '../../pubsub';
import { setStakeGeneralUIDataRedis } from '../../redis';
import { getGeneralStakeUIDataRPC } from '../../services/stake-data';
import * as lastSeenBlockState from '../last-seen-block.state';
import { getBlockContext } from '../task-helpers';
import * as lastSeenStoredDataHashState from './last-stored-hash.state';

const STATE_KEY = 'update-stake-general';
let _running = false;
export const running = () => _running;

export const handler = async () => {
  try {
    const blockContext = await getBlockContext(STATE_KEY);
    if (blockContext.shouldExecute) {
      const newData = await getGeneralStakeUIDataRPC();
      const newDataHash = createHash(newData);
      if (newDataHash === lastSeenStoredDataHashState.get()) {
        // data is identical, go to the next block
        console.log('Data is the same hash move to next block', {
          currentBlock: blockContext.currentBlock,
          lastSeenBlock: blockContext.lastSeenBlock,
          date: new Date(),
        });
        blockContext.commit();
        return;
      }

      lastSeenStoredDataHashState.set(newDataHash);

      setStakeGeneralUIDataRedis(newData);

      await pushUpdatedStakeGeneralUIDataToSubscriptions();
      console.log('published the stake general UI data', new Date());

      lastSeenBlockState.update(STATE_KEY, blockContext.currentBlock);
    }
  } catch (e) {
    console.error('Update stake user data task failed', e);
  }
};

export const startUp = () => {
  _running = true;
  console.log('updateStakeGeneralUIData job started up successfully');
};

export const stopHandler = () => {
  lastSeenBlockState.remove(STATE_KEY);
  _running = false;
  console.log('updateStakeGeneralUIData job stopped successfully');
};
