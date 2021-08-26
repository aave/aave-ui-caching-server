import * as ethereum from '../../src/helpers/ethereum';
import { sleep } from '../../src/helpers/utils';
import * as lastSeenBlockState from '../../src/tasks/last-seen-block.state';
import { getBlockContext, runTask } from '../../src/tasks/task-helpers';

jest.mock('../../src/helpers/ethereum', () => ({
  __esModule: true,
  getBlockNumber: jest.fn(),
}));

jest.mock('../../src/redis', () => ({
  __esModule: true,
  setBlockNumberRedis: jest.fn(),
}));

describe('taskHelpers', () => {
  describe('runTask', () => {
    it('should hit the handler the correct amount of times  and once running is stopped not hit it again', async () => {
      let count = 0;
      let running = true;

      runTask({
        runEvery: 100,
        mainHandler: () => {
          count++;
        },
        runningHandler: () => running,
      });

      await sleep(150);
      expect(count).toEqual(2);
      running = false;
      await sleep(100);
      expect(count).toEqual(2);
    });

    it('should not fire the handler until the startup has loaded', async () => {
      let count = 0;
      let running = true;
      runTask({
        runEvery: 100,
        startupHandler: async () => {
          await sleep(200);
        },
        mainHandler: () => {
          count++;
        },
        runningHandler: () => running,
      });

      await sleep(150);
      expect(count).toEqual(0);
      await sleep(200);
      expect(count).toBeGreaterThanOrEqual(1);
      running = false;
    });
  });

  describe('getBlockContext', () => {
    it('should call `getBlockNumber` with cache as true', async () => {
      const spy = jest.spyOn(ethereum, 'getBlockNumber');

      await getBlockContext('');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should call `getBlockNumber` with cache as false', async () => {
      const spy = jest.spyOn(ethereum, 'getBlockNumber');

      await getBlockContext('', false);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should call `lastSeenBlockState.get` with key', async () => {
      const spy = jest.spyOn(lastSeenBlockState, 'get');

      await getBlockContext('key', false);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('key');
    });

    it('should call return correct response', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(() => Promise.resolve(-1));

      const result = await getBlockContext('', false);

      expect(result.currentBlock).toEqual(-1);
      expect(result.lastSeenBlock).toEqual(0);
      expect(result.shouldExecute).toEqual(false);
      expect(result.commit).not.toBeUndefined();
    });

    it('should call return correct response', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(() => Promise.resolve(1));

      const result = await getBlockContext('', false);

      expect(result.currentBlock).toEqual(1);
      expect(result.lastSeenBlock).toEqual(0);
      expect(result.shouldExecute).toEqual(true);
      expect(result.commit).not.toBeUndefined();
    });

    it('should call update ', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(() => Promise.resolve(1));

      const result = await getBlockContext('', false);

      expect(result.currentBlock).toEqual(1);
      expect(result.lastSeenBlock).toEqual(0);
      expect(result.shouldExecute).toEqual(true);
      expect(result.commit).not.toBeUndefined();
    });

    it('should call `lastSeenBlockState.update` with key and current block if commit is called', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(() => Promise.resolve(1));
      const spy = jest.spyOn(lastSeenBlockState, 'update');

      const result = await getBlockContext('key', false);

      result.commit();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('key', result.currentBlock);
    });
  });
});
