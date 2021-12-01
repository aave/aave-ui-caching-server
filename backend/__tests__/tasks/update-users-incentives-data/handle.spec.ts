import { ILendingPoolAddressesProviderFactory } from '../../../src/contracts/ethers/ILendingPoolAddressesProviderFactory';
import { ILendingPoolFactory } from '../../../src/contracts/ethers/ILendingPoolFactory';
import * as ethereum from '../../../src/helpers/ethereum';
import * as pubsub from '../../../src/pubsub';
import * as lastSeenBlockState from '../../../src/tasks/last-seen-block.state';
import * as taskHelpers from '../../../src/tasks/task-helpers';
import {
  handler,
  running,
  startUp,
  stopHandler,
} from '../../../src/tasks/update-users-incentives-data/handler';
import * as poolContractsState from '../../../src/tasks/update-users-incentives-data/pool-contracts.state';
import * as poolIncentivesDataState from '../../../src/tasks/update-users-incentives-data/pool-incentives-data.state';
import { poolAddress, userAddress } from '../../mocks';

// @ts-ignore
poolIncentivesDataState.watch = jest.fn();

const ethereumProviderMock = {} as any;

jest.mock('../../../src/helpers/ethereum', () => ({
  __esModule: true,
  getBlockNumber: jest.fn(),
  getUsersFromLogs: jest.fn().mockImplementation(() => []),
  ethereumProvider: ethereumProviderMock,
}));

jest.mock('../../../src/pubsub', () => ({
  __esModule: true,
  pushUpdatedUserPoolIncentivesDataToSubscriptions: jest.fn(),
}));

const getPoolIncentivesDataMock = [
  {
    aIncentiveData: {
      emissionEndTimestamp: 1,
      tokenAddress: 'aTokenAddressMock1',
      incentiveControllerAddress: 'aTokenAddressMock1',
    },
    sIncentiveData: {
      emissionEndTimestamp: 1,
      tokenAddress: 'stableDebtTokenAddressMock1',
      incentiveControllerAddress: 'stableDebtTokenAddressMock1',
    },
    vIncentiveData: {
      emissionEndTimestamp: 1,
      tokenAddress: 'variableDebtTokenAddressMock1',
      incentiveControllerAddress: 'variableDebtTokenAddressMock1',
    },
  },
  {
    emissionEndTimestamp: 1,
    aIncentiveData: {
      emissionEndTimestamp: 1,
      tokenAddress: 'aTokenAddressMock2',
      incentiveControllerAddress: 'aTokenAddressMock2',
    },
    sIncentiveData: {
      emissionEndTimestamp: 1,
      tokenAddress: 'stableDebtTokenAddressMock2',
      incentiveControllerAddress: 'stableDebtTokenAddressMock2',
    },
    vIncentiveData: {
      emissionEndTimestamp: 1,
      tokenAddress: 'variableDebtTokenAddressMock2',
      incentiveControllerAddress: 'variableDebtTokenAddressMock2',
    },
  },
];

jest.mock('../../../src/services/incentives-data', () => ({
  __esModule: true,
  getPoolIncentivesRPC: jest.fn().mockImplementation(() => getPoolIncentivesDataMock),
  getPoolIncentives: jest.fn().mockImplementation(() => getPoolIncentivesDataMock),
}));

const testStartUp = async () => {
  jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 11);
  await startUp(poolAddress);
  jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 2);
};

const lendingPool = '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9';
const reserveUsedAsCollateralDisabledMock = 'reserveUsedAsCollateralDisabledMock';
const reserveUsedAsCollateralEnabledMock = 'reserveUsedAsCollateralEnabledMock';
const ILendingPoolMock = {
  queryFilter: jest.fn().mockImplementation(() => [{ args: { user: userAddress } }]),
  filters: {
    ReserveUsedAsCollateralDisabled: jest
      .fn()
      .mockImplementation(() => reserveUsedAsCollateralDisabledMock),
    ReserveUsedAsCollateralEnabled: jest
      .fn()
      .mockImplementation(() => reserveUsedAsCollateralEnabledMock),
  },
};

describe('update-user-incentive-data', () => {
  beforeEach(() => {
    ILendingPoolAddressesProviderFactory.connect = jest.fn().mockImplementation(() => {
      return {
        getLendingPool: jest.fn().mockImplementation(() => lendingPool),
      };
    });

    ILendingPoolFactory.connect = jest.fn().mockImplementation(() => ILendingPoolMock);
  });

  describe('handler', () => {
    it('should call `getBlockContext`', async () => {
      const spy = jest.spyOn(taskHelpers, 'getBlockContext');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress);
    });

    it('should get the block number once', async () => {
      const spy = jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 1);
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call anything in handler if current block is not higher then last seen block', async () => {
      await testStartUp();
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 1);
      await handler(poolAddress);

      const getUsersFromLogsSpy = jest.spyOn(ethereum, 'getUsersFromLogs');
      expect(getUsersFromLogsSpy).toHaveBeenCalledTimes(0);

      const ILendingPoolMockQueryFilterSpy = jest.spyOn(ILendingPoolMock, 'queryFilter');
      expect(ILendingPoolMockQueryFilterSpy).toHaveBeenCalledTimes(0);

      const pushUpdatedUserPoolIncentivesDataToSubscriptionsSpy = jest.spyOn(
        pubsub,
        'pushUpdatedUserPoolIncentivesDataToSubscriptions'
      );
      expect(pushUpdatedUserPoolIncentivesDataToSubscriptionsSpy).toHaveBeenCalledTimes(0);
    });

    it('should call `poolContractsState.get`', async () => {
      await testStartUp();
      const spy = jest.spyOn(poolContractsState, 'get');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress);
    });

    it('should call `poolIncentivesDataState.get`', async () => {
      await testStartUp();
      const spy = jest.spyOn(poolIncentivesDataState, 'get');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress);
    });

    it('should call getUsersFromLogs twice with correct parameters (one for rewards)', async () => {
      await testStartUp();
      const spy = jest.spyOn(ethereum, 'getUsersFromLogs');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.mock.calls[0]).toEqual([
        [
          'aTokenAddressMock1',
          'stableDebtTokenAddressMock1',
          'variableDebtTokenAddressMock1',
          'aTokenAddressMock2',
          'stableDebtTokenAddressMock2',
          'variableDebtTokenAddressMock2',
        ],
        1,
        2,
      ]);

      expect(spy.mock.calls[1]).toEqual([
        [
          'atokenaddressmock1',
          'stabledebttokenaddressmock1',
          'variabledebttokenaddressmock1',
          'atokenaddressmock2',
          'stabledebttokenaddressmock2',
          'variabledebttokenaddressmock2',
        ],
        1,
        2,
        ['RewardsClaimed(address,address,address,uint256)'],
      ]);
    });

    it('should call `pushUpdatedUserPoolIncentivesDataToSubscriptions` if only `usersToUpdate` has length', async () => {
      await testStartUp();
      jest.spyOn(ILendingPoolMock, 'queryFilter').mockImplementation(() => []);
      jest.spyOn(ethereum, 'getUsersFromLogs').mockImplementationOnce(async () => [userAddress]);
      const spy = jest.spyOn(pubsub, 'pushUpdatedUserPoolIncentivesDataToSubscriptions');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call `pushUpdatedUserPoolIncentivesDataToSubscriptions` if `usersToUpdate`, and `usersWithClaimedRewards` has no length', async () => {
      await testStartUp();
      jest.spyOn(ILendingPoolMock, 'queryFilter').mockImplementation(() => []);
      jest.spyOn(ethereum, 'getUsersFromLogs').mockImplementationOnce(async () => []);
      const spy = jest.spyOn(pubsub, 'pushUpdatedUserPoolIncentivesDataToSubscriptions');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('running + stopped + startup', () => {
    it('should return running false if stop handler is called', async () => {
      await startUp(poolAddress);
      expect(running()).toEqual(true);
      stopHandler(poolAddress);
      expect(running()).toEqual(false);
    });

    it('should call getBlockNumber once', async () => {
      const spy = jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 20);
      await startUp(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call `lastSeenBlockState.add`', async () => {
      const spy = jest.spyOn(lastSeenBlockState, 'add');
      const blockSpy = jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 20);
      await startUp(poolAddress);
      expect(blockSpy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress, 10);
    });

    it('should call `poolContractsState.init`', async () => {
      const spy = jest.spyOn(poolContractsState, 'init');
      await startUp(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress, ethereumProviderMock);
    });

    it('should call `poolIncentivesDataState.fetchAndAdd`', async () => {
      const spy = jest.spyOn(poolIncentivesDataState, 'fetchAndAdd');
      await startUp(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress);
    });

    it('should call `poolIncentivesDataState.watch`', async () => {
      const spy = jest.spyOn(poolIncentivesDataState, 'watch');
      await startUp(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress);
    });
  });
});
