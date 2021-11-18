import { getBlockNumber } from '../../helpers/ethereum';
import { createHash } from '../../helpers/utils';
import { pushUpdatedPoolIncentivesDataToSubscriptions } from '../../pubsub';
import { getPoolIncentivesDataRedis, setPoolIncentivesDataRedis } from '../../redis';
import { getPoolIncentivesRPC, IncentivesRPCType } from '../../services/incentives-data';
import * as lastSeenBlockState from '../last-seen-block.state';
import { getBlockContext } from '../task-helpers';

let _running = false;
export const running = () => _running;

export const handler = async ({
  lendingPoolAddressProvider,
  chainlinkFeedsRegistry,
  quote,
}: IncentivesRPCType) => {
  try {
    const incentivesKey = `incentives-${lendingPoolAddressProvider}`;
    const blockContext = await getBlockContext(incentivesKey);
    if (blockContext.shouldExecute) {
      const [newData, redisPoolIncentivesData] = await Promise.all([
        getPoolIncentivesRPC({ lendingPoolAddressProvider, chainlinkFeedsRegistry, quote }),
        getPoolIncentivesDataRedis(incentivesKey),
      ]);
      const newDataHash = createHash(newData);
      if (newDataHash === redisPoolIncentivesData?.hash) {
        console.log('Data is the same hash move to next block', {
          currentBlock: blockContext.currentBlock,
          lendingPoolAddressProvider,
          lastSeenBlock: blockContext.lastSeenBlock,
          date: new Date(),
        });
        blockContext.commit();
        return;
      }
      await Promise.all([
        setPoolIncentivesDataRedis(incentivesKey, {
          data: newData,
          hash: newDataHash,
        }),
        pushUpdatedPoolIncentivesDataToSubscriptions(lendingPoolAddressProvider, newData),
      ]);
      blockContext.commit();
      console.log(
        `${lendingPoolAddressProvider}: In block ${blockContext.currentBlock} protocol incentives data in redis was updated with hash ${newDataHash}`
      );
    }
  } catch (e) {
    console.error(
      `${lendingPoolAddressProvider}: updateReservesIncentivesData task was failed with error`,
      e
    );
  }
};

export const startUp = async (lendingPoolAddressProvider: string) => {
  const lastSeenBlockNumber = (await getBlockNumber()) - 1;
  // Added incentives to key, as to have it different from reserve pooling key
  lastSeenBlockState.add(`incentives-${lendingPoolAddressProvider}`, lastSeenBlockNumber);
  _running = true;

  console.log(
    `UpdateBlockNumber job started up successfully for lending pool address provider - incentives-${lendingPoolAddressProvider}`
  );
};

export const stopHandler = (lendingPoolAddressProvider: string) => {
  lastSeenBlockState.remove(`incentives-${lendingPoolAddressProvider}`);
  _running = false;
  console.log('updateReservesIncentivesData job stopped successfully');
};
