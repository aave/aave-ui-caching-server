import { CONFIG } from '../../config';
import { StakeUiHelperFactory } from '../../contracts/ethers/StakeUiHelperFactory';
import { StakeUiHelperI } from '../../contracts/ethers/StakeUiHelperI';
import { ethereumProvider } from '../../helpers/ethereum';

export const getStakeUiHelperFactory: () => StakeUiHelperI | null = () => {
  if (CONFIG.STAKE_DATA_PROVIDER) {
    return StakeUiHelperFactory.connect(CONFIG.STAKE_DATA_PROVIDER, ethereumProvider);
  }

  return null;
};

export default getStakeUiHelperFactory();
