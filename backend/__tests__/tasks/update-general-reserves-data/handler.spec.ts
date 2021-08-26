import * as ethereum from '../../../src/helpers/ethereum';
import * as pubsub from '../../../src/pubsub';
import * as redis from '../../../src/redis';
import * as poolDataRpc from '../../../src/services/pool-data/rpc';
import {
  handler,
  running,
  startUp,
  stopHandler,
} from '../../../src/tasks/update-general-reserves-data/handler';
import { poolAddress } from '../../mocks';

jest.mock('../../../src/helpers/ethereum', () => ({
  __esModule: true,
  getBlockNumber: jest.fn(),
}));

jest.mock('../../../src/redis', () => ({
  __esModule: true,
  setBlockNumberRedis: jest.fn(),
  getProtocolDataRedis: jest.fn(),
  setProtocolDataRedis: jest.fn(),
}));

const getProtocolDataRedisMock = {
  data: 'mockedGetProtocolDataRPC',
  hash: 'vCQEpPWzvsdKk6A6A9jFfg==',
};
const getProtocolDataRPCMockResponse = 'mockedGetProtocolDataRPC';

jest.mock('../../../src/services/pool-data/rpc', () => ({
  __esModule: true,
  getProtocolDataRPC: jest.fn().mockImplementation(() => getProtocolDataRPCMockResponse),
}));

describe('update-general-reserves-data', () => {
  describe('handler', () => {
    it('should get the block number once', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 0);
      const spy = jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 1);
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should only hit `getBlockNumber` if returns undefined', async () => {
      const spy = jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => undefined);
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call `getProtocolDataRPC` once', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 2);
      const spy = jest.spyOn(poolDataRpc, 'getProtocolDataRPC');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress);
    });

    it('should call `getProtocolDataRedis` once', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 3);
      const spy = jest.spyOn(redis, 'getProtocolDataRedis');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress);
    });

    it('should call `pushUpdatedReserveDataToSubscriptions` with the new data', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 4);
      const spy = jest.spyOn(pubsub, 'pushUpdatedReserveDataToSubscriptions');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress, getProtocolDataRPCMockResponse);
    });

    it('should call `pushUpdatedReserveDataToSubscriptions` with the new data', async () => {
      jest.spyOn(poolDataRpc, 'getProtocolDataRPC').mockImplementation(async () => {
        return { hey: true } as any;
      });
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 5);

      const spy = jest.spyOn(pubsub, 'pushUpdatedReserveDataToSubscriptions');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress, { hey: true });
    });

    it('should not call `pushUpdatedReserveDataToSubscriptions` with data that is the same', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 6);
      jest
        .spyOn(poolDataRpc, 'getProtocolDataRPC')
        .mockImplementation(async () => getProtocolDataRPCMockResponse as any);
      jest.spyOn(redis, 'getProtocolDataRedis').mockImplementation(async () => {
        return getProtocolDataRedisMock as any;
      });
      const spy = jest.spyOn(pubsub, 'pushUpdatedReserveDataToSubscriptions');

      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(0);

      jest.spyOn(redis, 'getProtocolDataRedis').mockImplementation(async () => undefined);
    });

    it('should call `setProtocolDataRedis` with the new data', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 8);
      const spy = jest.spyOn(redis, 'setProtocolDataRedis');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress, getProtocolDataRedisMock);
    });

    it('should call `setProtocolDataRedis` with the new data', async () => {
      jest.spyOn(poolDataRpc, 'getProtocolDataRPC').mockImplementation(async () => {
        return { hey: true } as any;
      });
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 9);
      const spy = jest.spyOn(redis, 'setProtocolDataRedis');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress, {
        data: { hey: true },
        hash: 'Hy2WrvTaiFkSXA0olfqraQ==',
      });
    });

    it('should not call `setProtocolDataRedis` with data that is the same', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 10);
      jest
        .spyOn(poolDataRpc, 'getProtocolDataRPC')
        .mockImplementation(async () => getProtocolDataRPCMockResponse as any);
      jest.spyOn(redis, 'getProtocolDataRedis').mockImplementation(async () => {
        return getProtocolDataRedisMock as any;
      });
      const spy = jest.spyOn(redis, 'setProtocolDataRedis');
      await handler(poolAddress);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should return if it sees the same block and not hit any methods', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 10);
      stopHandler(poolAddress);
      await startUp(poolAddress);
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 9);
      const spy = jest.spyOn(poolDataRpc, 'getProtocolDataRPC');
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
  });
});
