import { ILendingPoolAddressesProviderFactory } from '../../../src/contracts/ethers/ILendingPoolAddressesProviderFactory';
import { ILendingPoolFactory } from '../../../src/contracts/ethers/ILendingPoolFactory';
import {
  add,
  get,
  init,
} from '../../../src/tasks/update-users-incentives-data/pool-contracts.state';
import { poolAddress, userAddress } from '../../mocks';
import * as rpc from '../../../src/services/incentives-data';

const getPoolIncentivesRPCMockResponse = [
  {
    aIncentiveData: {
      incentiveControllerAddress: 'aTokenAddressMock1',
    },
    sIncentiveData: {
      incentiveControllerAddress: 'stableDebtTokenAddressMock1',
    },
    vIncentiveData: {
      incentiveControllerAddress: 'variableDebtTokenAddressMock1',
    },
  },
  {
    aIncentiveData: {
      incentiveControllerAddress: 'aTokenAddressMock2',
    },
    sIncentiveData: {
      incentiveControllerAddress: 'stableDebtTokenAddressMock2',
    },
    vIncentiveData: {
      incentiveControllerAddress: 'variableDebtTokenAddressMock2',
    },
  },
];
jest.mock('../../../src/services/incentives-data', () => ({
  __esModule: true,
  getPoolIncentivesRPC: jest.fn().mockImplementation(() => getPoolIncentivesRPCMockResponse),
}));

describe('poolContractsState', () => {
  describe('get', () => {
    it('should throw error if nothing in pool contracts', () => {
      expect(() => {
        get(poolAddress);
      }).toThrow();
    });

    it('should return pool contracts if defined', () => {
      const _object = {
        lendingPoolAddressProvider: poolAddress,
        incentiveControllers: ['123'],
        lendingPoolContract: {} as any,
      };
      add(_object);
      expect(get(poolAddress)).toEqual(_object);
    });
  });
  describe('add', () => {
    it('should add a pool contract', () => {
      const _object = {
        lendingPoolAddressProvider: poolAddress,
        incentiveControllers: ['123'],
        lendingPoolContract: {} as any,
      };
      add(_object);
      expect(get(poolAddress)).toEqual(_object);
    });

    it('should add a pool contracts', () => {
      const _object = {
        lendingPoolAddressProvider: poolAddress,
        incentiveControllers: ['123'],
        lendingPoolContract: {} as any,
      };

      const _object2 = {
        lendingPoolAddressProvider: '123',
        incentiveControllers: ['123'],
        lendingPoolContract: {} as any,
      };
      add(_object);
      add(_object2);
      expect(get(poolAddress)).toEqual(_object);
      expect(get('123')).toEqual(_object2);
    });

    it('should add only 1 pool contracts', () => {
      const _object = {
        lendingPoolAddressProvider: poolAddress,
        incentiveControllers: ['123'],
        lendingPoolContract: {} as any,
      };
      add(_object);
      add(_object);
      add(_object);
      expect(get(poolAddress)).toEqual(_object);
    });
  });

  describe('init', () => {
    const ethereumProviderMock = {} as any;
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

    beforeEach(() => {
      ILendingPoolAddressesProviderFactory.connect = jest.fn().mockImplementation(() => {
        return {
          getLendingPool: jest.fn().mockImplementation(() => lendingPool),
        };
      });

      ILendingPoolFactory.connect = jest.fn().mockImplementation(() => ILendingPoolMock);
    });

    it('should connect to `ILendingPoolAddressesProviderFactory`', async () => {
      const spy = jest.spyOn(ILendingPoolAddressesProviderFactory, 'connect');
      await init(poolAddress, ethereumProviderMock);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress, ethereumProviderMock);
    });

    it('should connect to `ILendingPoolFactory`', async () => {
      const spy = jest.spyOn(ILendingPoolFactory, 'connect');
      await init(poolAddress, ethereumProviderMock);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(lendingPool, ethereumProviderMock);
    });

    it('should call `getPoolIncentivesRPC`', async () => {
      const spy = jest.spyOn(rpc, 'getPoolIncentivesRPC');
      await init(poolAddress, ethereumProviderMock);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ lendingPoolAddressProvider: poolAddress });
    });

    it('should add to pool contracts', async () => {
      await init(poolAddress, ethereumProviderMock);
      expect(get(poolAddress).lendingPoolAddressProvider).toEqual(poolAddress);
    });
  });
});
