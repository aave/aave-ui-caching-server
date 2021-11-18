import { ILendingPool } from '../../contracts/ethers/ILendingPool';
import { ethereumProvider, getBlockNumber, getUsersFromLogs } from '../../helpers/ethereum';
import { pushUpdatedUserReserveDataToSubscriptions } from '../../pubsub';
import * as lastSeenBlockState from '../last-seen-block.state';
import { getBlockContext } from '../task-helpers';
import * as poolContractsState from './pool-contracts.state';
import * as protocolDataReservesState from './protocol-data-reserves.state';

let _running = false;
export const running = () => _running;

const getUsersWithUsageAsCollateralChange = async (
  lendingPoolContract: ILendingPool,
  lastSeenBlock: number,
  currentBlock: number
): Promise<string[]> => {
  const [disabledAsCollateralEvents, enabledAsColteralEvents] = await Promise.all([
    await lendingPoolContract.queryFilter(
      lendingPoolContract.filters.ReserveUsedAsCollateralDisabled(null, null),
      lastSeenBlock,
      currentBlock
    ),
    await lendingPoolContract.queryFilter(
      lendingPoolContract.filters.ReserveUsedAsCollateralEnabled(null, null),
      lastSeenBlock,
      currentBlock
    ),
  ]);
  return [...disabledAsCollateralEvents, ...enabledAsColteralEvents].map(
    (event) => event.args.user
  );
};

export const handler = async (lendingPoolAddressProvider: string) => {
  try {
    const blockContext = await getBlockContext(lendingPoolAddressProvider);
    if (blockContext.shouldExecute) {
      const poolContracts = poolContractsState.get(lendingPoolAddressProvider);
      console.log(
        `${poolContracts.lendingPoolContract.address}: parsing transfer events via Alchemy in blocks ${blockContext.lastSeenBlock} - ${blockContext.currentBlock}`
      );

      const [usersToUpdate, usersWithUsageAsCollateralChange] = await Promise.all([
        getUsersFromLogs(
          protocolDataReservesState.get(lendingPoolAddressProvider),
          blockContext.lastSeenBlock,
          blockContext.currentBlock
        ),
        getUsersWithUsageAsCollateralChange(
          poolContracts.lendingPoolContract,
          blockContext.lastSeenBlock,
          blockContext.currentBlock
        ),
      ]);

      console.log('usersToUpdate', usersToUpdate);
      console.log('usersWithUsageAsCollateralChange', usersWithUsageAsCollateralChange);

      console.log(
        `${lendingPoolAddressProvider}: Events tracked: ${
          usersToUpdate.length + usersWithUsageAsCollateralChange.length
        }`
      );
      if (usersToUpdate.length || usersWithUsageAsCollateralChange.length) {
        const uniqueUsersToUpdate = [
          ...new Set([...usersToUpdate, ...usersWithUsageAsCollateralChange]),
        ];
        console.log(`${lendingPoolAddressProvider}: Users to update ${uniqueUsersToUpdate.length}`);
        await Promise.all(
          uniqueUsersToUpdate.map(
            async (user) =>
              await pushUpdatedUserReserveDataToSubscriptions(lendingPoolAddressProvider, user)
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
    console.error(`${lendingPoolAddressProvider}: Users data update was failed with error`, e);
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
