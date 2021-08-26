import * as redis from '../../../src/redis';
import {
  getStakeGeneralUIData,
  getStakeUserUIData,
} from '../../../src/services/stake-data/provider';
import * as rpc from '../../../src/services/stake-data/rpc';
import { userAddress } from '../../mocks';

jest.mock('../../../src/redis', () => ({
  __esModule: true,
  getStakeUserUIDataRedis: jest.fn(),
  setStakeUserUIDataRedis: jest.fn(),
  getStakeGeneralUIDataRedis: jest.fn(),
  setStakeGeneralUIDataRedis: jest.fn(),
}));

const getStakeUserUIDataRPCMockResponse = 'mockedGetStakeUserUIDataRPC';
const getStakeGeneralUIDataRPCMockResponse = 'mockedGetStakeGeneralUIDataRPC';

jest.mock('../../../src/services/stake-data/rpc', () => ({
  __esModule: true,
  getUserStakeUIDataRPC: jest.fn().mockImplementation(() => getStakeUserUIDataRPCMockResponse),
  getGeneralStakeUIDataRPC: jest
    .fn()
    .mockImplementation(() => getStakeGeneralUIDataRPCMockResponse),
}));

describe('provider', () => {
  describe('getStakeUserUIData', () => {
    it('should not call cache if forceCache is passed in as true', async () => {
      const redisGetSpy = jest.spyOn(redis, 'getStakeUserUIDataRedis');
      const redisSetSpy = jest.spyOn(redis, 'setStakeUserUIDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getUserStakeUIDataRPC');

      const result = await getStakeUserUIData(userAddress, true);
      expect(result).toEqual(getStakeUserUIDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(0);

      expect(rpcSpy).toHaveBeenCalledTimes(1);
      expect(rpcSpy).toHaveBeenCalledWith(userAddress);

      expect(redisSetSpy).toHaveBeenCalledTimes(1);
      expect(redisSetSpy).toHaveBeenCalledWith(userAddress, getStakeUserUIDataRPCMockResponse);
    });

    it('should call cache if forceCache is passed in as false (empty cache path)', async () => {
      const redisGetSpy = jest.spyOn(redis, 'getStakeUserUIDataRedis');
      const redisSetSpy = jest.spyOn(redis, 'setStakeUserUIDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getUserStakeUIDataRPC');

      const result = await getStakeUserUIData(userAddress, false);
      expect(result).toEqual(getStakeUserUIDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledWith(userAddress);

      expect(rpcSpy).toHaveBeenCalledTimes(1);
      expect(rpcSpy).toHaveBeenCalledWith(userAddress);

      expect(redisSetSpy).toHaveBeenCalledTimes(1);
      expect(redisSetSpy).toHaveBeenCalledWith(userAddress, getStakeUserUIDataRPCMockResponse);
    });

    it('should call cache if forceCache is passed in as false (cache defined path)', async () => {
      const redisGetSpy = jest
        .spyOn(redis, 'getStakeUserUIDataRedis')
        .mockImplementationOnce(async () => getStakeUserUIDataRPCMockResponse as any);
      const redisSetSpy = jest.spyOn(redis, 'setStakeUserUIDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getUserStakeUIDataRPC');

      const result = await getStakeUserUIData(userAddress, false);
      expect(result).toEqual(getStakeUserUIDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledWith(userAddress);

      expect(rpcSpy).toHaveBeenCalledTimes(0);

      expect(redisSetSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('getStakeGeneralUIData', () => {
    it('should not call cache if forceCache is passed in as true', async () => {
      const redisGetSpy = jest.spyOn(redis, 'getStakeGeneralUIDataRedis');
      const redisSetSpy = jest.spyOn(redis, 'setStakeGeneralUIDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getGeneralStakeUIDataRPC');

      const result = await getStakeGeneralUIData(true);
      expect(result).toEqual(getStakeGeneralUIDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(0);

      expect(rpcSpy).toHaveBeenCalledTimes(1);
      expect(rpcSpy).toHaveBeenCalledWith();

      expect(redisSetSpy).toHaveBeenCalledTimes(1);
      expect(redisSetSpy).toHaveBeenCalledWith(getStakeGeneralUIDataRPCMockResponse);
    });

    it('should call cache if forceCache is passed in as false (empty cache path)', async () => {
      const redisGetSpy = jest.spyOn(redis, 'getStakeGeneralUIDataRedis');
      const redisSetSpy = jest.spyOn(redis, 'setStakeGeneralUIDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getGeneralStakeUIDataRPC');

      const result = await getStakeGeneralUIData(false);
      expect(result).toEqual(getStakeGeneralUIDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledWith();

      expect(rpcSpy).toHaveBeenCalledTimes(1);
      expect(rpcSpy).toHaveBeenCalledWith();

      expect(redisSetSpy).toHaveBeenCalledTimes(1);
      expect(redisSetSpy).toHaveBeenCalledWith(getStakeGeneralUIDataRPCMockResponse);
    });

    it('should call cache if forceCache is passed in as false (cache defined path)', async () => {
      const redisGetSpy = jest
        .spyOn(redis, 'getStakeGeneralUIDataRedis')
        .mockImplementationOnce(async () => getStakeGeneralUIDataRPCMockResponse as any);
      const redisSetSpy = jest.spyOn(redis, 'setStakeGeneralUIDataRedis');

      const rpcSpy = jest.spyOn(rpc, 'getGeneralStakeUIDataRPC');

      const result = await getStakeGeneralUIData(false);
      expect(result).toEqual(getStakeGeneralUIDataRPCMockResponse);

      expect(redisGetSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledWith();

      expect(rpcSpy).toHaveBeenCalledTimes(0);

      expect(redisSetSpy).toHaveBeenCalledTimes(0);
    });
  });
});
