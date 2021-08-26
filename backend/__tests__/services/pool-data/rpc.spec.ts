import { getProtocolDataRPC, getProtocolUserDataRPC } from '../../../src/services/pool-data/rpc';
import { poolAddress, userAddress } from '../../mocks';

describe('rpc', () => {
  describe('getProtocolDataRPC', () => {
    it('should return `ProtocolData`', async () => {
      const result = await getProtocolDataRPC(poolAddress);
      expect(result).toBeInstanceOf(Object);
      expect(result.reserves).toBeInstanceOf(Object);
      expect(typeof result.usdPriceEth).toEqual('string');
      expect(typeof result.emissionEndTimestamp).toEqual('number');
    });
  });

  describe('getProtocolUserDataRPC', () => {
    it('should return `UserData`', async () => {
      const result = await getProtocolUserDataRPC(poolAddress, userAddress);
      expect(result).toBeInstanceOf(Object);
      expect(result.userReserves).toBeInstanceOf(Array);
      expect(typeof result.userUnclaimedRewards).toEqual('string');
    });
  });
});
