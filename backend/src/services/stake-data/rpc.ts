import {
  UiStakeDataProvider,
  UiStakeDataProviderContext,
  UiStakeDataProviderInterface,
} from '@aave/contract-helpers';
import { CONFIG, STAKING_CONFIG } from '../../config';
import { StakeGeneralUIData } from '../../graphql/object-types/stake-general-data';
import { StakeUserUIData } from '../../graphql/object-types/stake-user-data';
import { ethereumProvider } from '../../helpers/ethereum';

let uiStakeDataProvider: UiStakeDataProviderInterface | null = null;

export const getStakeDataProvider = (): UiStakeDataProviderInterface | null => {
  if (!uiStakeDataProvider && STAKING_CONFIG.STAKE_DATA_PROVIDER) {
    const uiStakeDataProviderConfig: UiStakeDataProviderContext = {
      uiStakeDataProvider: STAKING_CONFIG.STAKE_DATA_PROVIDER,
      provider: ethereumProvider,
    };

    uiStakeDataProvider = new UiStakeDataProvider(uiStakeDataProviderConfig);
  }

  return uiStakeDataProvider;
};

/**
 * Get the stake user data using rpc
 * @param userAddress The user address
 */
export const getUserStakeUIDataRPC = async (userAddress: string): Promise<StakeUserUIData> => {
  const stakeProvider = getStakeDataProvider();
  return stakeProvider!.getUserStakeUIDataHumanized({ user: userAddress });
};

/**
 * Get the stake general data using rpc
 */
export const getGeneralStakeUIDataRPC = async (): Promise<StakeGeneralUIData> => {
  const stakeProvider = getStakeDataProvider();
  return stakeProvider!.getGeneralStakeUIDataHumanized();
};
