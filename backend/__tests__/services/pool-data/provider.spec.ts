import * as redis from '../../../src/redis';
import { getProtocolData, getProtocolUserData } from '../../../src/services/pool-data/provider';
import * as rpc from '../../../src/services/pool-data/rpc';

jest.mock('../../../src/redis', () => ({
  __esModule: true,
  getProtocolDataRedis: jest.fn(),
  setProtocolDataRedis: jest.fn(),
  getProtocolUserDataRedis: jest.fn(),
  setProtocolUserDataRedis: jest.fn(),
}));

const getProtocolDataRPCMockResponse = 'mockedGetProtocolDataRPC';
const getProtocolUserDataRPCMockResponse = {
  data: 'mockedGetProtocolDataRPC',
  hash: 'vCQEpPWzvsdKk6A6A9jFfg==',
};

jest.mock('../../../src/services/pool-data/rpc', () => ({
  __esModule: true,
  getProtocolDataRPC: jest.fn().mockImplementation(() => getProtocolDataRPCMockResponse),
  getProtocolUserDataRPC: jest.fn().mockImplementation(() => getProtocolUserDataRPCMockResponse),
}));

describe('provider', () => {
  const poolAddress = '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5';
  const userAddress = '0x45Cd08334aeedd8a06265B2Ae302E3597d8fAA28';

  describe('getProtocolData', () => {
    it('should return no value from redis and call rpc method', async () => {
      const redisGetSpy = jest
        .spyOn(redis, 'getProtocolDataRedis')
        .mockImplementationOnce(async () => null);
      const redisSetSpy = jest.spyOn(redis, 'setProtocolDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getProtocolDataRPC');

      const result = await getProtocolData(poolAddress);
      expect(result).toEqual(getProtocolDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledWith(poolAddress);

      expect(rpcSpy).toHaveBeenCalledTimes(1);
      expect(rpcSpy).toHaveBeenCalledWith(poolAddress);

      expect(redisSetSpy).toHaveBeenCalledTimes(1);
      expect(redisSetSpy).toHaveBeenCalledWith(poolAddress, getProtocolUserDataRPCMockResponse);
    });

    it('should get value from redis and not call rpc method', async () => {
      const redisGetSpy = jest
        .spyOn(redis, 'getProtocolDataRedis')
        .mockImplementationOnce(async () => getProtocolUserDataRPCMockResponse as any);
      const redisSetSpy = jest.spyOn(redis, 'setProtocolDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getProtocolDataRPC');

      const result = await getProtocolData(poolAddress);
      expect(result).toEqual(getProtocolDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledWith(poolAddress);

      expect(rpcSpy).toHaveBeenCalledTimes(0);

      expect(redisSetSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('getProtocolUserData', () => {
    it('should not call cache if cacheFirst is passed in as false', async () => {
      const redisGetSpy = jest.spyOn(redis, 'getProtocolUserDataRedis');
      const redisSetSpy = jest.spyOn(redis, 'setProtocolUserDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getProtocolUserDataRPC');

      const result = await getProtocolUserData(poolAddress, userAddress, false);
      expect(result).toEqual(getProtocolUserDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(0);

      expect(rpcSpy).toHaveBeenCalledTimes(1);
      expect(rpcSpy).toHaveBeenCalledWith(poolAddress, userAddress);

      expect(redisSetSpy).toHaveBeenCalledTimes(1);
      expect(redisSetSpy).toHaveBeenCalledWith(
        poolAddress,
        userAddress,
        getProtocolUserDataRPCMockResponse
      );
    });

    it('should call cache if cacheFirst is passed in as true (empty cache path)', async () => {
      const redisGetSpy = jest.spyOn(redis, 'getProtocolUserDataRedis');
      const redisSetSpy = jest.spyOn(redis, 'setProtocolUserDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getProtocolUserDataRPC');

      const result = await getProtocolUserData(poolAddress, userAddress, true);
      expect(result).toEqual(getProtocolUserDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledWith(poolAddress, userAddress);

      expect(rpcSpy).toHaveBeenCalledTimes(1);
      expect(rpcSpy).toHaveBeenCalledWith(poolAddress, userAddress);

      expect(redisSetSpy).toHaveBeenCalledTimes(1);
      expect(redisSetSpy).toHaveBeenCalledWith(
        poolAddress,
        userAddress,
        getProtocolUserDataRPCMockResponse
      );
    });

    it('should call cache if cacheFirst is passed in as true (cache defined path)', async () => {
      const redisGetSpy = jest
        .spyOn(redis, 'getProtocolUserDataRedis')
        .mockImplementationOnce(async () => getProtocolUserDataRPCMockResponse as any);
      const redisSetSpy = jest.spyOn(redis, 'setProtocolUserDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getProtocolUserDataRPC');

      const result = await getProtocolUserData(poolAddress, userAddress, true);
      expect(result).toEqual(getProtocolUserDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledWith(poolAddress, userAddress);

      expect(rpcSpy).toHaveBeenCalledTimes(0);

      expect(redisSetSpy).toHaveBeenCalledTimes(0);
    });
  });
});
