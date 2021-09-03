import {
  AAVE_TOKEN_ADDRESS,
  ABPT_TOKEN,
  STK_AAVE_TOKEN_ADDRESS,
  STK_ABPT_TOKEN_ADDRESS,
} from '../../../src/config';
import * as ethereum from '../../../src/helpers/ethereum';
import * as pubsub from '../../../src/pubsub';
import {
  handler,
  running,
  startUp,
  stopHandler,
} from '../../../src/tasks/update-stake-user-ui-data/handler';
import { userAddress } from '../../mocks';

jest.mock('../../../src/helpers/ethereum', () => ({
  __esModule: true,
  getBlockNumber: jest.fn(),
  getUsersFromLogs: jest.fn().mockImplementation(() => []),
}));

jest.mock('../../../src/pubsub', () => ({
  __esModule: true,
  pushUpdatedStakeUserUIDataToSubscriptions: jest.fn(),
}));

describe('update-stake-user-ui-data', () => {
  describe('handler', () => {
    it('should get the block number once', async () => {
      const spy = jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 1);
      await handler();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call `getUsersFromLogs` twice', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 2);
      const spy = jest.spyOn(ethereum, 'getUsersFromLogs');
      await handler();
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.mock.calls).toEqual([
        [
          [STK_AAVE_TOKEN_ADDRESS, STK_ABPT_TOKEN_ADDRESS],
          1,
          2,
          ['RewardsClaimed(address,address,uint256)'],
        ],
        [
          [STK_AAVE_TOKEN_ADDRESS, STK_ABPT_TOKEN_ADDRESS, AAVE_TOKEN_ADDRESS, ABPT_TOKEN],
          1,
          2,
          ['Transfer(address,address,uint256)'],
        ],
      ]);
    });

    it('should not call `pushUpdatedStakeUserUIDataToSubscriptions` if no users', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 3);
      const spy = jest.spyOn(pubsub, 'pushUpdatedStakeUserUIDataToSubscriptions');
      await handler();
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should call `pushUpdatedStakeUserUIDataToSubscriptions` as many times as users returned, this also tests that it removes duplicates', async () => {
      jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 4);
      jest.spyOn(ethereum, 'getUsersFromLogs').mockImplementation(async () => [userAddress]);
      const spy = jest.spyOn(pubsub, 'pushUpdatedStakeUserUIDataToSubscriptions');
      await handler();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('running + stopped + startup', () => {
    it('should return running false if stop handler is called', async () => {
      await startUp();
      expect(running()).toEqual(true);
      stopHandler();
      expect(running()).toEqual(false);
    });

    it('should call getBlockNumber once', async () => {
      const spy = jest.spyOn(ethereum, 'getBlockNumber').mockImplementation(async () => 20);
      await startUp();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
