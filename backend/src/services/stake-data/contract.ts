import { STAKING_CONFIG } from '../../config';
import { StakeUiHelperFactory } from '../../contracts/ethers/StakeUiHelperFactory';
import { StakeUiHelperI } from '../../contracts/ethers/StakeUiHelperI';
import { ethereumProvider } from '../../helpers/ethereum';

export const getStakeUiHelperFactory: () => StakeUiHelperI | null = () => {
  if (STAKING_CONFIG.STAKE_DATA_PROVIDER) {
    return StakeUiHelperFactory.connect(STAKING_CONFIG.STAKE_DATA_PROVIDER, ethereumProvider);
  }

  return null;
};

export default getStakeUiHelperFactory();
