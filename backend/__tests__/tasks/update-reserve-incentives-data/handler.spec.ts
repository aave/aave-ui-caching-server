import * as ethereum from '../../../src/helpers/ethereum';
import * as pubsub from '../../../src/pubsub';
import * as redis from '../../../src/redis';
import * as incentivesDataRpc from '../../../src/services/incentives-data/rpc';
import {
  handler,
  running,
  startUp,
  stopHandler,
} from '../../../src/tasks/update-reserve-incentives-data/handler';
import { poolAddress } from '../../mocks';

jest.mock('../../../src/helpers/ethereum', () => ({
  __esModule: true,
  getBlockNumber: jest.fn(),
}));

jest.mock('../../../src/redis', () => ({
  __esModule: true,
  setBlockNumberRedis: jest.fn(),
  getPoolIncentivesDataRedis: jest.fn(),
  setPoolIncentivesDataRedis: jest.fn(),
}));

const getPoolIncentivesDataRedisMock = {
  data: 'mockedGetPoolIncentivesDataRPC',
  hash: 'URoxJmPFVj5vuT0oJ0SK7A==',
};
const getPoolIncentivesDataRPCMockResponse = 'mockedGetPoolIncentivesDataRPC';

jest.mock('../../../src/services/incentives-data/rpc', () => ({
  __esModule: true,
  getPoolIncentivesRPC: jest.fn().mockImplementation(() => getPoolIncentivesDataRPCMockResponse),
}));

describe('update-reserve-incentives-data', () => {
  const incentivesKey = `incentives-${poolAddress}`;
  describe('handler', () => {
    it('should get the block number once', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 0);
      const spy = jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 1);
      await handler({ lendingPoolAddressProvider: poolAddress });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should only hit `getBlockNumber` if returns undefined', async () => {
      const spy = jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => undefined);
      await handler({ lendingPoolAddressProvider: poolAddress });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call `getPoolIncentivesRPC` once', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 2);
      const spy = jest.spyOn(incentivesDataRpc, 'getPoolIncentivesRPC');
      await handler({ lendingPoolAddressProvider: poolAddress });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ lendingPoolAddressProvider: poolAddress });
    });

    it('should call `getPoolIncentivesRPC` once', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 3);
      const spy = jest.spyOn(redis, 'getPoolIncentivesDataRedis');
      await handler({ lendingPoolAddressProvider: poolAddress });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(incentivesKey);
    });

    it('should call `pushUpdatedPoolIncentivesDataToSubscriptions` with the new data', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 4);
      const spy = jest.spyOn(pubsub, 'pushUpdatedPoolIncentivesDataToSubscriptions');
      await handler({ lendingPoolAddressProvider: poolAddress });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress, getPoolIncentivesDataRPCMockResponse);
    });

    it('should call `pushUpdatedPoolIncentivesDataToSubscriptions` with the new data', async () => {
      jest.spyOn(incentivesDataRpc, 'getPoolIncentivesRPC').mockImplementation(async () => {
        return { hey: true } as any;
      });
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 5);

      const spy = jest.spyOn(pubsub, 'pushUpdatedPoolIncentivesDataToSubscriptions');
      await handler({ lendingPoolAddressProvider: poolAddress });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress, { hey: true });
    });

    it('should not call `pushUpdatedPoolIncentivesDataToSubscriptions` with data that is the same', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 6);
      jest
        .spyOn(incentivesDataRpc, 'getPoolIncentivesRPC')
        .mockImplementation(async () => getPoolIncentivesDataRPCMockResponse as any);
      jest.spyOn(redis, 'getPoolIncentivesDataRedis').mockImplementation(async () => {
        return getPoolIncentivesDataRedisMock as any;
      });
      const spy = jest.spyOn(pubsub, 'pushUpdatedPoolIncentivesDataToSubscriptions');

      await handler({ lendingPoolAddressProvider: poolAddress });
      expect(spy).toHaveBeenCalledTimes(0);

      jest.spyOn(redis, 'getPoolIncentivesDataRedis').mockImplementation(async () => undefined);
    });

    it('should call `setPoolIncentivesDataRedis` with the new data', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 8);
      const spy = jest.spyOn(redis, 'setPoolIncentivesDataRedis');
      await handler({ lendingPoolAddressProvider: poolAddress });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(incentivesKey, getPoolIncentivesDataRedisMock);
    });

    it('should call `setPoolIncentivesDataRedis` with the new data', async () => {
      jest.spyOn(incentivesDataRpc, 'getPoolIncentivesRPC').mockImplementation(async () => {
        return { hey: true } as any;
      });
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 9);
      const spy = jest.spyOn(redis, 'setPoolIncentivesDataRedis');
      await handler({ lendingPoolAddressProvider: poolAddress });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(incentivesKey, {
        data: { hey: true },
        hash: 'Hy2WrvTaiFkSXA0olfqraQ==',
      });
    });

    it('should not call `setPoolIncentivesDataRedis` with data that is the same', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 10);
      jest
        .spyOn(incentivesDataRpc, 'getPoolIncentivesRPC')
        .mockImplementation(async () => getPoolIncentivesDataRPCMockResponse as any);
      jest.spyOn(redis, 'getPoolIncentivesDataRedis').mockImplementation(async () => {
        return getPoolIncentivesDataRedisMock as any;
      });
      const spy = jest.spyOn(redis, 'setPoolIncentivesDataRedis');
      await handler({ lendingPoolAddressProvider: poolAddress });
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should return if it sees the same block and not hit any methods', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 10);
      stopHandler(poolAddress);
      await startUp(poolAddress);
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 9);
      const spy = jest.spyOn(incentivesDataRpc, 'getPoolIncentivesRPC');
      await handler({ lendingPoolAddressProvider: poolAddress });
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
  });
});
