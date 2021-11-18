import * as poolIncentivesDataProvider from '../../../src/services/incentives-data';
import {
  add,
  fetchAndAdd,
  get,
} from '../../../src/tasks/update-users-incentives-data/pool-incentives-data.state';
import { poolAddress } from '../../mocks';

const getProtocolDataMock = [
  {
    aIncentiveData: {
      emissionEndTimestamp: 1,
      tokenAddress: 'aTokenAddressMock1',
    },
    sIncentiveData: {
      emissionEndTimestamp: 1,
      tokenAddress: 'stableDebtTokenAddressMock1',
    },
    vIncentiveData: {
      emissionEndTimestamp: 1,
      tokenAddress: 'variableDebtTokenAddressMock1',
    },
  },
  {
    emissionEndTimestamp: 1,
    aIncentiveData: {
      emissionEndTimestamp: 1,
      tokenAddress: 'aTokenAddressMock2',
    },
    sIncentiveData: {
      emissionEndTimestamp: 1,
      tokenAddress: 'stableDebtTokenAddressMock2',
    },
    vIncentiveData: {
      emissionEndTimestamp: 1,
      tokenAddress: 'variableDebtTokenAddressMock2',
    },
  },
];

jest.mock('../../../src/services/incentives-data', () => ({
  __esModule: true,
  getPoolIncentives: jest.fn().mockImplementation(() => getProtocolDataMock),
}));

describe('poolIncentivesState', () => {
  describe('fetchAndAdd', () => {
    it('should call `getPoolIncentives`', async () => {
      const spy = jest.spyOn(poolIncentivesDataProvider, 'getPoolIncentives');
      await fetchAndAdd(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ lendingPoolAddressProvider: poolAddress });
    });

    it('should add reserve lists for pool', async () => {
      const spy = jest.spyOn(poolIncentivesDataProvider, 'getPoolIncentives');
      const _poolAddress = 'POOOOOOOOOOL';
      const list = await fetchAndAdd(_poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ lendingPoolAddressProvider: _poolAddress });
      expect(get(_poolAddress)).toEqual(list);
    });
  });
});
