import * as redis from '../../../src/redis';
import {
  getPoolIncentives,
  getUserPoolIncentives,
} from '../../../src/services/incentives-data/provider';
import * as rpc from '../../../src/services/incentives-data/rpc';

jest.mock('../../../src/redis', () => ({
  __esModule: true,
  getPoolIncentivesDataRedis: jest.fn(),
  setPoolIncentivesDataRedis: jest.fn(),
  getPoolIncentivesUserDataRedis: jest.fn(),
  setPoolIncentivesUserDataRedis: jest.fn(),
}));

const getPoolIncentivesRPCMockResponse = 'mockedGetProtocolDataRPC';
const getPoolIncentivesUserDataRPCMockResponse = {
  data: 'mockedGetProtocolDataRPC',
  hash: 'vCQEpPWzvsdKk6A6A9jFfg==',
};

jest.mock('../../../src/services/incentives-data/rpc', () => ({
  __esModule: true,
  getPoolIncentivesRPC: jest.fn().mockImplementation(() => getPoolIncentivesRPCMockResponse),
  getUserPoolIncentivesRPC: jest
    .fn()
    .mockImplementation(() => getPoolIncentivesUserDataRPCMockResponse),
}));

describe('provider', () => {
  const lendingPoolAddressProvider = '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5';
  const userAddress = '0x45Cd08334aeedd8a06265B2Ae302E3597d8fAA28';
  const incentivesKey = `incentives-${lendingPoolAddressProvider}`;

  describe('getPoolIncentivesData', () => {
    it('should return no value from redis and call rpc method', async () => {
      const redisGetSpy = jest.spyOn(redis, 'getPoolIncentivesDataRedis');
      const redisSetSpy = jest.spyOn(redis, 'setPoolIncentivesDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getPoolIncentivesRPC');

      const result = await getPoolIncentives({ lendingPoolAddressProvider });
      expect(result).toEqual(getPoolIncentivesRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledWith(incentivesKey);

      expect(rpcSpy).toHaveBeenCalledTimes(1);
      expect(rpcSpy).toHaveBeenCalledWith({ lendingPoolAddressProvider });

      expect(redisSetSpy).toHaveBeenCalledTimes(1);
      expect(redisSetSpy).toHaveBeenCalledWith(
        incentivesKey,
        getPoolIncentivesUserDataRPCMockResponse
      );
    });

    it('should get value from redis and not call rpc method', async () => {
      const redisGetSpy = jest
        .spyOn(redis, 'getPoolIncentivesDataRedis')
        .mockImplementationOnce(async () => getPoolIncentivesUserDataRPCMockResponse as any);
      const redisSetSpy = jest.spyOn(redis, 'setPoolIncentivesDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getPoolIncentivesRPC');

      const result = await getPoolIncentives({ lendingPoolAddressProvider });
      expect(result).toEqual(getPoolIncentivesRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledWith(incentivesKey);

      expect(rpcSpy).toHaveBeenCalledTimes(0);

      expect(redisSetSpy).toHaveBeenCalledTimes(0);
    });
  });
  describe('getUserPoolIncentives', () => {
    it('should not call cache if cacheFirst is passed in as false', async () => {
      const redisGetSpy = jest.spyOn(redis, 'getPoolIncentivesUserDataRedis');
      const redisSetSpy = jest.spyOn(redis, 'setPoolIncentivesUserDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getUserPoolIncentivesRPC');

      const result = await getUserPoolIncentives(lendingPoolAddressProvider, userAddress, false);
      expect(result).toEqual(getPoolIncentivesUserDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(0);

      expect(rpcSpy).toHaveBeenCalledTimes(1);
      expect(rpcSpy).toHaveBeenCalledWith(lendingPoolAddressProvider, userAddress);

      expect(redisSetSpy).toHaveBeenCalledTimes(1);
      expect(redisSetSpy).toHaveBeenCalledWith(
        incentivesKey,
        userAddress,
        getPoolIncentivesUserDataRPCMockResponse
      );
    });

    it('should call cache if cacheFirst is passed in as true (empty cache path)', async () => {
      const redisGetSpy = jest.spyOn(redis, 'getPoolIncentivesUserDataRedis');
      const redisSetSpy = jest.spyOn(redis, 'setPoolIncentivesUserDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getUserPoolIncentivesRPC');

      const result = await getUserPoolIncentives(lendingPoolAddressProvider, userAddress, true);
      expect(result).toEqual(getPoolIncentivesUserDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledWith(incentivesKey, userAddress);

      expect(rpcSpy).toHaveBeenCalledTimes(1);
      expect(rpcSpy).toHaveBeenCalledWith(lendingPoolAddressProvider, userAddress);

      expect(redisSetSpy).toHaveBeenCalledTimes(1);
      expect(redisSetSpy).toHaveBeenCalledWith(
        incentivesKey,
        userAddress,
        getPoolIncentivesUserDataRPCMockResponse
      );
    });

    it('should call cache if cacheFirst is passed in as true (cache defined path)', async () => {
      const redisGetSpy = jest
        .spyOn(redis, 'getPoolIncentivesUserDataRedis')
        .mockImplementationOnce(async () => getPoolIncentivesUserDataRPCMockResponse as any);
      const redisSetSpy = jest.spyOn(redis, 'setPoolIncentivesUserDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getUserPoolIncentivesRPC');

      const result = await getUserPoolIncentives(lendingPoolAddressProvider, userAddress, true);
      expect(result).toEqual(getPoolIncentivesUserDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledWith(incentivesKey, userAddress);

      expect(rpcSpy).toHaveBeenCalledTimes(0);

      expect(redisSetSpy).toHaveBeenCalledTimes(0);
    });
  });
});
