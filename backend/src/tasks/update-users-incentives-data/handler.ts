import * as lastSeenBlockState from '../last-seen-block.state';
import { ethereumProvider, getBlockNumber, getUsersFromLogs } from '../../helpers/ethereum';
import * as poolContractsState from './pool-contracts.state';
import * as protocolDataReservesState from './pool-incentives-data.state';
import { getBlockContext } from '../task-helpers';
import { pushUpdatedUserPoolIncentivesDataToSubscriptions } from '../../pubsub';

let _running = false;
export const running = () => _running;

export const handler = async (poolAddress: string) => {
  try {
    const blockContext = await getBlockContext(poolAddress);
    if (blockContext.shouldExecute) {
      const poolContracts = poolContractsState.get(poolAddress);
      console.log(
        `${poolContracts.lendingPoolContract.address}: parsing transfer events via Alchemy in blocks ${blockContext.lastSeenBlock} - ${blockContext.currentBlock}`
      );

      const [usersToUpdate, usersWithClaimedRewards] = await Promise.all([
        getUsersFromLogs(
          protocolDataReservesState.get(poolAddress),
          blockContext.lastSeenBlock,
          blockContext.currentBlock
        ),
        getUsersFromLogs(
          poolContracts.incentiveControllers,
          blockContext.lastSeenBlock,
          blockContext.currentBlock,
          ['RewardsClaimed(address,address,address,uint256)']
        ),
      ]);

      console.log('usersToUpdate', usersToUpdate);
      console.log('usersWithClaimedRewardsLogs', usersWithClaimedRewards);

      console.log(
        `${poolAddress}: Events tracked: ${usersToUpdate.length + usersWithClaimedRewards.length}`
      );
      if (usersToUpdate.length || usersWithClaimedRewards.length) {
        const uniqueUsersToUpdate = [...new Set([...usersToUpdate, ...usersWithClaimedRewards])];
        console.log(`${poolAddress}: Users to update ${uniqueUsersToUpdate.length}`);
        await Promise.all(
          uniqueUsersToUpdate.map(
            async (user) =>
              await pushUpdatedUserPoolIncentivesDataToSubscriptions(poolAddress, user)
          )
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
    console.error(`${poolAddress}: Users data update was failed with error`, e);
  }
};

export const startUp = async (lendingPoolAddressProvider: string) => {
  const lastSeenBlock = (await getBlockNumber()) - 10;
  lastSeenBlockState.add(lendingPoolAddressProvider, lastSeenBlock);

  await poolContractsState.init(lendingPoolAddressProvider, ethereumProvider);

  await protocolDataReservesState.fetchAndAdd(lendingPoolAddressProvider);
  protocolDataReservesState.watch(lendingPoolAddressProvider);

  _running = true;
  console.log('updateUserData job started up successfully');
};

export const stopHandler = (lendingPoolAddressProvider: string) => {
  lastSeenBlockState.remove(lendingPoolAddressProvider);
  _running = false;
  console.log('updateUserData job stopped successfully');
};
