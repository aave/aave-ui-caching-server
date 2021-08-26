import * as poolDataProvider from '../../../src/services/pool-data/provider';
import {
  add,
  fetchAndAdd,
  get,
} from '../../../src/tasks/update-users-data/protocol-data-reserves.state';
import { poolAddress } from '../../mocks';

const getProtocolDataMock = {
  reserves: [
    {
      aTokenAddress: 'aTokenAddressMock1',
      stableDebtTokenAddress: 'stableDebtTokenAddressMock1',
      variableDebtTokenAddress: 'variableDebtTokenAddressMock1',
    },
    {
      aTokenAddress: 'aTokenAddressMock2',
      stableDebtTokenAddress: 'stableDebtTokenAddressMock2',
      variableDebtTokenAddress: 'variableDebtTokenAddressMock2',
    },
  ],
};

jest.mock('../../../src/services/pool-data/provider', () => ({
  __esModule: true,
  getProtocolData: jest.fn().mockImplementation(() => getProtocolDataMock),
}));

describe('protocolDataReservesState', () => {
  const poolAddress2 = '0x012';

  describe('add + get', () => {
    it('should add a item and get it back', () => {
      add(poolAddress, ['1']);
      expect(get(poolAddress)).toEqual(['1']);
    });

    it('should add only 1 item and get it back', () => {
      add(poolAddress, ['1']);
      add(poolAddress, ['2']);
      add(poolAddress, ['3']);
      add(poolAddress2, ['1']);
      expect(get(poolAddress)).toEqual(['3']);
      expect(get(poolAddress2)).toEqual(['1']);
    });

    it('should throw if no reserves in list', () => {
      add(poolAddress, []);
      expect(() => {
        get(poolAddress);
      }).toThrowError(`reservesList for ${poolAddress} is empty`);
    });

    it('should throw if no pool found', () => {
      expect(() => {
        get('UNKNOWN');
      }).toThrowError('reservesList for UNKNOWN is empty');
    });
  });

  describe('fetchAndAdd', () => {
    it('should call `getProtocolData`', async () => {
      const spy = jest.spyOn(poolDataProvider, 'getProtocolData');
      await fetchAndAdd(poolAddress);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(poolAddress);
    });

    it('should add reserve lists for pool', async () => {
      const _poolAddress = 'POOOOOOOOOOL';
      const list = await fetchAndAdd(_poolAddress);
      expect(get(_poolAddress)).toEqual(list);
    });
  });
});
