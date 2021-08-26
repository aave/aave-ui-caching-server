import { StakeGeneralUIData } from '../../graphql/object-types/stake-general-data';
import { StakeUserUIData } from '../../graphql/object-types/stake-user-data';
import StakeUiHelperI from './contract';

/**
 * Get the stake user data using rpc
 * @param userAddress The user address
 */
export const getUserStakeUIDataRPC = async (userAddress: string): Promise<StakeUserUIData> => {
  const { 0: aave, 1: bpt, 2: usdPriceEth } = await StakeUiHelperI!.getUserStakeUIData(userAddress);

  return {
    aave: {
      stakeTokenUserBalance: aave.stakeTokenUserBalance.toHexString(),
      underlyingTokenUserBalance: aave.underlyingTokenUserBalance.toHexString(),
      userCooldown: aave.userCooldown.toNumber(),
      userIncentivesToClaim: aave.userIncentivesToClaim.toHexString(),
      userPermitNonce: aave.userPermitNonce.toHexString(),
    },
    bpt: {
      stakeTokenUserBalance: bpt.stakeTokenUserBalance.toHexString(),
      underlyingTokenUserBalance: bpt.underlyingTokenUserBalance.toHexString(),
      userCooldown: bpt.userCooldown.toNumber(),
      userIncentivesToClaim: bpt.userIncentivesToClaim.toHexString(),
      userPermitNonce: bpt.userPermitNonce.toHexString(),
    },
    usdPriceEth: usdPriceEth.toHexString(),
  };
};

/**
 * Get the stake general data using rpc
 */
export const getGeneralStakeUIDataRPC = async (): Promise<StakeGeneralUIData> => {
  const { 0: aave, 1: bpt, 2: usdPriceEth } = await StakeUiHelperI!.getGeneralStakeUIData();

  return {
    aave: {
      stakeTokenTotalSupply: aave.stakeTokenTotalSupply.toHexString(),
      stakeCooldownSeconds: aave.stakeCooldownSeconds.toNumber(),
      stakeUnstakeWindow: aave.stakeUnstakeWindow.toNumber(),
      stakeTokenPriceEth: aave.stakeTokenPriceEth.toHexString(),
      rewardTokenPriceEth: aave.rewardTokenPriceEth.toHexString(),
      stakeApy: aave.stakeApy.toHexString(),
      distributionPerSecond: aave.distributionPerSecond.toHexString(),
      distributionEnd: aave.distributionEnd.toHexString(),
    },
    bpt: {
      stakeTokenTotalSupply: bpt.stakeTokenTotalSupply.toHexString(),
      stakeCooldownSeconds: bpt.stakeCooldownSeconds.toNumber(),
      stakeUnstakeWindow: bpt.stakeUnstakeWindow.toNumber(),
      stakeTokenPriceEth: bpt.stakeTokenPriceEth.toHexString(),
      rewardTokenPriceEth: bpt.rewardTokenPriceEth.toHexString(),
      stakeApy: bpt.stakeApy.toHexString(),
      distributionPerSecond: bpt.distributionPerSecond.toHexString(),
      distributionEnd: bpt.distributionEnd.toHexString(),
    },
    usdPriceEth: usdPriceEth.toHexString(),
  };
};
