import * as ethereum from '../../../src/helpers/ethereum';
import * as redis from '../../../src/redis';
import {
  handler,
  running,
  startUp,
  stopHandler,
} from '../../../src/tasks/update-block-number/handler';

jest.mock('../../../src/helpers/ethereum', () => ({
  __esModule: true,
  getBlockNumber: jest.fn(),
}));

jest.mock('../../../src/redis', () => ({
  __esModule: true,
  setBlockNumberRedis: jest.fn(),
}));

describe('update-block-number handler', () => {
  describe('handler', () => {
    it('should get the rpc block number and set it', async () => {
      const spy = jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 1);
      const spy2 = jest.spyOn(redis, 'setBlockNumberRedis');
      await handler();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
    });

    it('should get the rpc block number and not set if last seen is lower then block number', async () => {
      const spy = jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 1);
      const spy2 = jest.spyOn(redis, 'setBlockNumberRedis');
      await handler();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
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
