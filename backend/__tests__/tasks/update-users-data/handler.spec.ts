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
} from '../../../src/tasks/update-users-data/handler';
import * as poolContractsState from '../../../src/tasks/update-users-data/pool-contracts.state';
import * as protocolDataReservesState from '../../../src/tasks/update-users-data/protocol-data-reserves.state';
import { poolAddress, userAddress } from '../../mocks';

// @ts-ignore
protocolDataReservesState.watch = jest.fn();

const ethereumProviderMock = {} as any;

jest.mock('../../../src/helpers/ethereum', () => ({
  __esModule: true,
  getBlockNumber: jest.fn(),
  getUsersFromLogs: jest.fn().mockImplementation(() => []),
  ethereumProvider: ethereumProviderMock,
}));

jest.mock('../../../src/pubsub', () => ({
  __esModule: true,
  pushUpdatedUserReserveDataToSubscriptions: jest.fn(),
}));

const getProtocolDataMock = {
  reserves: [
    {
      aTokenAddress: 'aTokenAddressMock1',
      stableDebtTokenAddress: 'stableDebtTokenAddressMock1',
      variableDebtTokenAddress: 'variableDebtTokenAddressMock1',
    },
    {
      aTokenAddress: 'aTokenAddressMock2',
      stableDebtTokenAddress: 'stableDebtTokenAddressMock2',
      variableDebtTokenAddress: 'variableDebtTokenAddressMock2',
    },
  ],
};

jest.mock('../../../src/services/pool-data/provider', () => ({
  __esModule: true,
  getProtocolData: jest.fn().mockImplementation(() => getProtocolDataMock),
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

describe('update-user-data', () => {
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

      const pushUpdatedUserReserveDataToSubscriptionsSpy = jest.spyOn(
        pubsub,
        'pushUpdatedUserReserveDataToSubscriptions'
      );
      expect(pushUpdatedUserReserveDataToSubscriptionsSpy).toHaveBeenCalledTimes(0);
    });

    it('should call `poolContractsState.get`', async () => {
      await testStartUp();
      const spy = jest.spyOn(poolContractsState, 'get');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress);
    });

    it('should call `protocolDataReservesState.get`', async () => {
      await testStartUp();
      const spy = jest.spyOn(protocolDataReservesState, 'get');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress);
    });

    it('should call getUsersFromLogs twice with correct parameters (one for rewards)', async () => {
      await testStartUp();
      const spy = jest.spyOn(ethereum, 'getUsersFromLogs');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
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
    });

    it('should call `ILendingPool.queryFilter` twice with correct parameters', async () => {
      await testStartUp();
      const spy = jest.spyOn(ILendingPoolMock, 'queryFilter');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.mock.calls[0]).toEqual([reserveUsedAsCollateralDisabledMock, 1, 2]);
      expect(spy.mock.calls[1]).toEqual([reserveUsedAsCollateralEnabledMock, 1, 2]);
    });

    it('should call `ILendingPool.filters.ReserveUsedAsCollateralDisabled` once with correct parameters', async () => {
      await testStartUp();
      const spy = jest.spyOn(ILendingPoolMock.filters, 'ReserveUsedAsCollateralDisabled');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(null, null);
    });

    it('should call `ILendingPool.filters.ReserveUsedAsCollateralEnabled` once with correct parameters', async () => {
      await testStartUp();
      const spy = jest.spyOn(ILendingPoolMock.filters, 'ReserveUsedAsCollateralDisabled');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(null, null);
    });

    it('should call `pushUpdatedUserReserveDataToSubscriptions` as many times as users returned, this also tests that it removes duplicates', async () => {
      await testStartUp();
      const spy = jest.spyOn(pubsub, 'pushUpdatedUserReserveDataToSubscriptions');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call `pushUpdatedUserReserveDataToSubscriptions` if only `usersToUpdate` has length', async () => {
      await testStartUp();
      jest.spyOn(ILendingPoolMock, 'queryFilter').mockImplementation(() => []);
      jest.spyOn(ethereum, 'getUsersFromLogs').mockImplementationOnce(async () => [userAddress]);
      const spy = jest.spyOn(pubsub, 'pushUpdatedUserReserveDataToSubscriptions');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call `pushUpdatedUserReserveDataToSubscriptions` if only `usersWithUsageAsCollateralChange` has length', async () => {
      await testStartUp();
      jest
        .spyOn(ILendingPoolMock, 'queryFilter')
        .mockImplementation(() => [{ args: { user: userAddress } }]);
      jest.spyOn(ethereum, 'getUsersFromLogs').mockImplementation(async () => []);
      const spy = jest.spyOn(pubsub, 'pushUpdatedUserReserveDataToSubscriptions');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call `pushUpdatedUserReserveDataToSubscriptions` if `usersToUpdate`, `usersWithUsageAsCollateralChange` and `usersWithClaimedRewards` has no length', async () => {
      await testStartUp();
      jest.spyOn(ILendingPoolMock, 'queryFilter').mockImplementation(() => []);
      jest.spyOn(ethereum, 'getUsersFromLogs').mockImplementationOnce(async () => []);
      const spy = jest.spyOn(pubsub, 'pushUpdatedUserReserveDataToSubscriptions');
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
      await startUp(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress, 10);
    });

    it('should call `poolContractsState.init`', async () => {
      const spy = jest.spyOn(poolContractsState, 'init');
      await startUp(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress, ethereumProviderMock);
    });

    it('should call `protocolDataReservesState.fetchAndAdd`', async () => {
      const spy = jest.spyOn(protocolDataReservesState, 'fetchAndAdd');
      await startUp(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress);
    });

    it('should call `protocolDataReservesState.watch`', async () => {
      const spy = jest.spyOn(protocolDataReservesState, 'watch');
      await startUp(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress);
    });
  });
});
