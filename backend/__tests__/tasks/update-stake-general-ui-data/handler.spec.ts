import * as ethereum from '../../../src/helpers/ethereum';
import * as pubsub from '../../../src/pubsub';
import * as redis from '../../../src/redis';
import * as RPC from '../../../src/services/stake-data/rpc';
import {
  handler,
  running,
  startUp,
  stopHandler,
} from '../../../src/tasks/update-stake-general-ui-data/handler';

jest.mock('../../../src/redis', () => ({
  __esModule: true,
  setStakeGeneralUIDataRedis: jest.fn(),
}));

jest.mock('../../../src/helpers/ethereum', () => ({
  __esModule: true,
  getBlockNumber: jest.fn(),
}));

jest.mock('../../../src/services/stake-data/rpc', () => ({
  __esModule: true,
  getGeneralStakeUIDataRPC: jest.fn(),
}));

jest.mock('../../../src/pubsub', () => ({
  __esModule: true,
  pushUpdatedStakeGeneralUIDataToSubscriptions: jest.fn(),
}));

describe('stake-general-ui-data', () => {
  describe('handler', () => {
    it('should get the block number once', async () => {
      const spy = jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 1);
      await handler();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call `getGeneralStakeUIDataRPC`', async () => {
      jest.spyOn(RPC, 'getGeneralStakeUIDataRPC').mockImplementation(async () => {
        return { hey: 2 } as any;
      });
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 2);
      const spy = jest.spyOn(RPC, 'getGeneralStakeUIDataRPC');
      await handler();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call `setStakeGeneralUIDataRedis`', async () => {
      jest.spyOn(RPC, 'getGeneralStakeUIDataRPC').mockImplementation(async () => {
        return { hey: 3 } as any;
      });
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 3);
      const spy = jest.spyOn(redis, 'setStakeGeneralUIDataRedis');
      await handler();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call `pushUpdatedStakeGeneralUIDataToSubscriptions` ', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 4);
      jest.spyOn(RPC, 'getGeneralStakeUIDataRPC').mockImplementation(async () => {
        return { hey: 4 } as any;
      });
      const spy = jest.spyOn(pubsub, 'pushUpdatedStakeGeneralUIDataToSubscriptions');
      await handler();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call `pushUpdatedStakeGeneralUIDataToSubscriptions` or `getGeneralStakeUIDataRPC` or `setStakeGeneralUIDataRedis` if block number is not higher', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 4);
      jest.spyOn(RPC, 'getGeneralStakeUIDataRPC').mockImplementation(async () => {
        return { hey: 5 } as any;
      });
      const stakeSpy = jest.spyOn(RPC, 'getGeneralStakeUIDataRPC');
      const pubSubSpy = jest.spyOn(pubsub, 'pushUpdatedStakeGeneralUIDataToSubscriptions');
      const redisSpy = jest.spyOn(redis, 'setStakeGeneralUIDataRedis');
      await handler();
      expect(stakeSpy).toHaveBeenCalledTimes(0);
      expect(pubSubSpy).toHaveBeenCalledTimes(0);
      expect(redisSpy).toHaveBeenCalledTimes(0);
    });

    it('should not call `pushUpdatedStakeGeneralUIDataToSubscriptions` or `setStakeGeneralUIDataRedis` if last seen stored data hash is the same', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 5);
      jest.spyOn(RPC, 'getGeneralStakeUIDataRPC').mockImplementation(async () => {
        return { hey: 4 } as any;
      });
      const stakeSpy = jest.spyOn(RPC, 'getGeneralStakeUIDataRPC');
      const pubSubSpy = jest.spyOn(pubsub, 'pushUpdatedStakeGeneralUIDataToSubscriptions');
      const redisSpy = jest.spyOn(redis, 'setStakeGeneralUIDataRedis');
      await handler();
      expect(stakeSpy).toHaveBeenCalledTimes(1);
      expect(pubSubSpy).toHaveBeenCalledTimes(0);
      expect(redisSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('running + stopped + startup', () => {
    it('should return running false if stop handler is called', () => {
      startUp();
      expect(running()).toEqual(true);
      stopHandler();
      expect(running()).toEqual(false);
    });
  });
});
