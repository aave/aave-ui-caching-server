import { ethers } from 'ethers';
import { AaveIncentivesController } from '../../contracts/ethers/AaveIncentivesController';
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

const getUsersWithClaimedRewards = async (
  incentivesControllerContract: AaveIncentivesController,
  lastSeenBlock: number,
  currentBlock: number
): Promise<string[]> => {
  // TODO: temp solution, to make it more solid we should collect incentive controllers across all of the a/v/s tokens
  if (incentivesControllerContract.address === ethers.constants.AddressZero) {
    return [];
  }

  const events = await incentivesControllerContract.queryFilter(
    incentivesControllerContract.filters.RewardsClaimed(null, null, null),
    lastSeenBlock,
    currentBlock
  );
  return events.map((event) => event.args.user);
};

export const handler = async (poolAddress: string) => {
  try {
    const blockContext = await getBlockContext(poolAddress);
    if (blockContext.shouldExecute) {
      const poolContracts = poolContractsState.get(poolAddress);
      console.log(
        `${poolContracts.lendingPoolContract.address}: parsing transfer events via Alchemy in blocks ${blockContext.lastSeenBlock} - ${blockContext.currentBlock}`
      );

      const [usersToUpdate, usersWithUsageAsCollateralChange, usersWithClaimedRewards] =
        await Promise.all([
          getUsersFromLogs(
            protocolDataReservesState.get(poolAddress),
            blockContext.lastSeenBlock,
            blockContext.currentBlock
          ),
          getUsersWithUsageAsCollateralChange(
            poolContracts.lendingPoolContract,
            blockContext.lastSeenBlock,
            blockContext.currentBlock
          ),
          getUsersWithClaimedRewards(
            poolContracts.incentivesController,
            blockContext.lastSeenBlock,
            blockContext.currentBlock
          ),
        ]);

      console.log(
        `${poolAddress}: Events tracked: ${
          usersToUpdate.length +
          usersWithUsageAsCollateralChange.length +
          usersWithClaimedRewards.length
        }`
      );
      if (
        usersToUpdate.length ||
        usersWithUsageAsCollateralChange.length ||
        usersWithClaimedRewards.length
      ) {
        const uniqueUsersToUpdate = [
          ...new Set([
            ...usersToUpdate,
            ...usersWithUsageAsCollateralChange,
            ...usersWithClaimedRewards,
          ]),
        ];
        console.log(`${poolAddress}: Users to update ${uniqueUsersToUpdate.length}`);
        await Promise.all(
          uniqueUsersToUpdate.map(
            async (user) => await pushUpdatedUserReserveDataToSubscriptions(poolAddress, user)
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

export const startUp = async (poolAddress: string) => {
  const lastSeenBlock = (await getBlockNumber()) - 10;
  lastSeenBlockState.add(poolAddress, lastSeenBlock);

  await poolContractsState.init(poolAddress, ethereumProvider);

  await protocolDataReservesState.fetchAndAdd(poolAddress);
  protocolDataReservesState.watch(poolAddress);

  _running = true;
  console.log('updateUserData job started up successfully');
};

export const stopHandler = (poolAddress: string) => {
  lastSeenBlockState.remove(poolAddress);
  _running = false;
  console.log('updateUserData job stopped successfully');
};
