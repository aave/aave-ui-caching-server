import { getProtocolDataRPC, getProtocolUserDataRPC } from '../../../src/services/pool-data/rpc';
import { poolAddress, userAddress } from '../../mocks';

xdescribe('rpc', () => {
  describe('getProtocolDataRPC', () => {
    it('should return `ProtocolData`', async () => {
      const result = await getProtocolDataRPC(poolAddress);
      expect(result).toBeInstanceOf(Object);
      expect(result.reserves).toBeInstanceOf(Object);
      expect(result.baseCurrencyData).toBeInstanceOf(Object);
    });
  });

  describe('getProtocolUserDataRPC', () => {
    it('should return `UserData`', async () => {
      const result = await getProtocolUserDataRPC(poolAddress, userAddress);
      expect(result).toBeInstanceOf(Object);
      expect(result).toBeInstanceOf(Array);
    });
  });
});
