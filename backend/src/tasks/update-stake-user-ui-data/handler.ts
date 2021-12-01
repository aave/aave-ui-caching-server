import { STAKING_CONFIG } from '../../config';
import { getBlockNumber, getUsersFromLogs } from '../../helpers/ethereum';
import { pushUpdatedStakeUserUIDataToSubscriptions } from '../../pubsub';
import * as lastSeenBlockState from '../last-seen-block.state';
import { getBlockContext } from '../task-helpers';

const STATE_KEY = 'update-stake-user-ui-data';
let _running = false;
export const running = () => _running;

export const handler = async () => {
  try {
    const blockContext = await getBlockContext(STATE_KEY);
    if (blockContext.shouldExecute) {
      const [claimedRewardUsers, transferUsers] = await Promise.all([
        getUsersFromLogs(
          [STAKING_CONFIG.STK_AAVE_TOKEN_ADDRESS, STAKING_CONFIG.STK_ABPT_TOKEN_ADDRESS],
          blockContext.lastSeenBlock,
          blockContext.currentBlock,
          ['RewardsClaimed(address,address,uint256)']
        ),
        getUsersFromLogs(
          [
            STAKING_CONFIG.STK_AAVE_TOKEN_ADDRESS,
            STAKING_CONFIG.STK_ABPT_TOKEN_ADDRESS,
            STAKING_CONFIG.AAVE_TOKEN_ADDRESS,
            STAKING_CONFIG.ABPT_TOKEN,
          ],
          blockContext.lastSeenBlock,
          blockContext.currentBlock,
          ['Transfer(address,address,uint256)']
        ),
      ]);

      const users = [...new Set([...claimedRewardUsers, ...transferUsers])];
      if (users.length > 0) {
        console.log('published the stake user UI data', { users, date: new Date() });
        await Promise.all(
          users.map(async (user) => {
            await pushUpdatedStakeUserUIDataToSubscriptions(user);
          })
        );
      } else {
        console.log('no new users affected move to next block', {
          lastSeenBlock: blockContext.lastSeenBlock,
          currentBlock: blockContext.currentBlock,
          date: new Date(),
        });
      }

      blockContext.commit();
    }
  } catch (e) {
    console.error('Update stake user data task failed', e);
  }
};

export const startUp = async () => {
  _running = true;
  const blockNumber = (await getBlockNumber()) - 10;
  lastSeenBlockState.add(STATE_KEY, blockNumber);
  console.log('updateStakeUserUIData job started up successfully');
};

export const stopHandler = () => {
  lastSeenBlockState.remove(STATE_KEY);
  _running = false;
  console.log('updateStakeGeneralUIData job stopped successfully');
};
