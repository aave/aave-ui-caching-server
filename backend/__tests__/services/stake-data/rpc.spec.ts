import {
  getGeneralStakeUIDataRPC,
  getUserStakeUIDataRPC,
} from '../../../src/services/stake-data/rpc';
import { poolAddress } from '../../mocks';

describe('rpc', () => {
  describe('getUserStakeUIDataRPC', () => {
    it('should return `StakeUserUIData`', async () => {
      const result = await getUserStakeUIDataRPC(poolAddress);
      expect(result).toBeInstanceOf(Object);
      expect(result.aave).toBeInstanceOf(Object);
      expect(result.aave.stakeTokenUserBalance).not.toBeUndefined();
      // @ts-ignore
      expect(result.aave.stakeTokenTotalSupply).toBeUndefined();
      expect(result.bpt).toBeInstanceOf(Object);
      expect(result.bpt.stakeTokenUserBalance).not.toBeUndefined();
      // @ts-ignore
      expect(result.bpt.stakeTokenTotalSupply).toBeUndefined();
      expect(typeof result.usdPriceEth).toEqual('string');
    });
  });

  describe('getGeneralStakeUIDataRPC', () => {
    it('should return `StakeGeneralUIData`', async () => {
      const result = await getGeneralStakeUIDataRPC();
      expect(result).toBeInstanceOf(Object);
      expect(result.aave).toBeInstanceOf(Object);
      expect(result.aave.stakeTokenTotalSupply).not.toBeUndefined();
      // @ts-ignore
      expect(result.aave.stakeTokenUserBalance).toBeUndefined();
      expect(result.bpt).toBeInstanceOf(Object);
      expect(result.bpt.stakeTokenTotalSupply).not.toBeUndefined();
      // @ts-ignore
      expect(result.bpt.stakeTokenUserBalance).toBeUndefined();
      expect(typeof result.usdPriceEth).toEqual('string');
    });
  });
});
