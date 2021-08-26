import { getBlockNumber } from '../../helpers/ethereum';
import { createHash } from '../../helpers/utils';
import { pushUpdatedReserveDataToSubscriptions } from '../../pubsub';
import { getProtocolDataRedis, setProtocolDataRedis } from '../../redis';
import { getProtocolDataRPC } from '../../services/pool-data';
import * as lastSeenBlockState from '../last-seen-block.state';
import { getBlockContext } from '../task-helpers';

let _running = false;
export const running = () => _running;

export const handler = async (poolAddress: string) => {
  try {
    const blockContext = await getBlockContext(poolAddress);
    if (blockContext.shouldExecute) {
      const [newData, redisProtcolPoolData] = await Promise.all([
        getProtocolDataRPC(poolAddress),
        getProtocolDataRedis(poolAddress),
      ]);
      const newDataHash = createHash(newData);
      if (newDataHash === redisProtcolPoolData?.hash) {
        console.log('Data is the same hash move to next block', {
          currentBlock: blockContext.currentBlock,
          poolAddress,
          lastSeenBlock: blockContext.lastSeenBlock,
          date: new Date(),
        });
        blockContext.commit();
        return;
      }
      await Promise.all([
        setProtocolDataRedis(poolAddress, { data: newData, hash: newDataHash }),
        pushUpdatedReserveDataToSubscriptions(poolAddress, newData),
      ]);
      blockContext.commit();
      console.log(
        `${poolAddress}: In block ${blockContext.currentBlock} protocol data in redis was updated with hash ${newDataHash}`
      );
    }
  } catch (e) {
    console.error(`${poolAddress}: updateGeneralReservesData task was failed with error`, e);
  }
};

export const startUp = async (poolAddress: string) => {
  const lastSeenBlockNumber = (await getBlockNumber()) - 1;
  lastSeenBlockState.add(poolAddress, lastSeenBlockNumber);
  _running = true;

  console.log(`UpdateBlockNumber job started up successfully for pool address - ${poolAddress}`);
};

export const stopHandler = (poolAddress: string) => {
  lastSeenBlockState.remove(poolAddress);
  _running = false;
  console.log('updateGeneralReservesData job stopped successfully');
};
