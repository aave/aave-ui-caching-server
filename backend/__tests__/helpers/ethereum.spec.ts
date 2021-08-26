import { providers } from 'ethers';
import {
  alchemyWeb3Provider,
  ethereumProvider,
  getBlockNumber,
  getBlockNumberRpc,
  getUsersFromLogs,
} from '../../src/helpers/ethereum';
import * as redis from '../../src/redis';

jest.mock('../../src/redis', () => ({
  __esModule: true,
  getBlockNumberRedis: jest.fn(),
  setBlockNumberRedis: jest.fn(),
}));

describe('ethereum', () => {
  describe('ethereumProvider', () => {
    // when we start using the custom provider then add this test back in
    // xit('should be instance of `AaveCustomProvider`', () => {
    //   expect(ethereumProvider).toBeInstanceOf(AaveCustomProvider);
    // });

    it('should be instance of `JsonRpcProvider`', () => {
      expect(ethereumProvider).toBeInstanceOf(providers.StaticJsonRpcProvider);
    });
  });

  describe('alchemyWeb3Provider', () => {
    it('should be instance of `AlchemyWeb3`', () => {
      expect(alchemyWeb3Provider.eth).not.toBeUndefined();
    });
  });

  describe('getBlockNumberRpc', () => {
    it('should return block number from node', async () => {
      const spy = jest.spyOn(ethereumProvider, 'getBlockNumber').mockImplementation(async () => 1);
      const blockNumber = await getBlockNumberRpc();
      expect(blockNumber).toEqual(1);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should return 0 if getBlockNumber throws an error', async () => {
      const spy = jest.spyOn(ethereumProvider, 'getBlockNumber').mockImplementation(async () => {
        throw new Error('error');
      });
      const blockNumber = await getBlockNumberRpc();
      expect(blockNumber).toEqual(0);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBlockNumber', () => {
    it('should not call redis cache if useCache is false and call rpc method', async () => {
      const getBlockNumberSpy = jest
        .spyOn(ethereumProvider, 'getBlockNumber')
        .mockImplementation(async () => 1);
      const redisGetSpy = jest.spyOn(redis, 'getBlockNumberRedis');
      const blockNumber = await getBlockNumber(false);
      expect(blockNumber).toEqual(1);
      expect(getBlockNumberSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledTimes(0);
    });

    it('should call redis cache if useCache is true and call rpc method', async () => {
      const getBlockNumberSpy = jest
        .spyOn(ethereumProvider, 'getBlockNumber')
        .mockImplementation(async () => 1);
      const redisGetSpy = jest.spyOn(redis, 'getBlockNumberRedis');
      const blockNumber = await getBlockNumber(true);
      expect(blockNumber).toEqual(1);
      expect(getBlockNumberSpy).toHaveBeenCalledTimes(1);
      expect(redisGetSpy).toHaveBeenCalledTimes(1);
    });

    it('should call redis cache if useCache is true and not call rpc method', async () => {
      const getBlockNumberSpy = jest
        .spyOn(ethereumProvider, 'getBlockNumber')
        .mockImplementation(async () => 1);
      const redisGetSpy = jest
        .spyOn(redis, 'getBlockNumberRedis')
        .mockImplementation(async () => '1');
      const blockNumber = await getBlockNumber(true);
      expect(blockNumber).toEqual(1);
      expect(redisGetSpy).toHaveBeenCalledTimes(1);
      expect(getBlockNumberSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('getUsersFromLogs', () => {
    it('should return transfer events for the contract', async () => {
      const getPastLogsSpy = jest.spyOn(alchemyWeb3Provider.eth, 'getPastLogs');
      const decodeLog = jest.spyOn(alchemyWeb3Provider.eth.abi, 'decodeLog');

      const users = await getUsersFromLogs(
        ['0x4da27a545c0c5b758a6ba100e3a049001de870f5'],
        12964000,
        12964252
      );
      expect(users.length).toEqual(5);

      expect(getPastLogsSpy).toHaveBeenCalledTimes(1);
      expect(getPastLogsSpy).toHaveBeenCalledWith({
        address: ['0x4da27a545c0c5b758a6ba100e3a049001de870f5'],
        fromBlock: '0xc5d0a0',
        toBlock: '0xc5d19c',
        topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
      });

      // only 4 raw logs but remember it sends to to and from
      expect(decodeLog).toHaveBeenCalledTimes(4);
    });
  });
});
