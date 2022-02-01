import {
  ReservesIncentiveDataHumanized,
  UiIncentiveDataProvider,
  UiIncentiveDataProviderContext,
  UiIncentiveDataProviderInterface,
  UserReservesIncentivesDataHumanized,
} from '@aave/contract-helpers';
import { ethereumProvider } from '../../helpers/ethereum';
import { CONFIG, CHAIN_ID } from '../../config';
import { ReserveIncentivesData } from '../../graphql/object-types/incentives';
import { UserIncentivesData } from '../../graphql/object-types/user-incentives';

let uiIncentiveProvider: UiIncentiveDataProviderInterface;

export const getPoolIncentivesDataProvider = (): UiIncentiveDataProviderInterface => {
  if (!uiIncentiveProvider) {
    const uiIncentiveProviderConfig: UiIncentiveDataProviderContext = {
      uiIncentiveDataProviderAddress: CONFIG.UI_INCENTIVE_DATA_PROVIDER_ADDRESS,
      provider: ethereumProvider,
      chainId: CHAIN_ID,
    };
    uiIncentiveProvider = new UiIncentiveDataProvider(uiIncentiveProviderConfig);
  }
  return uiIncentiveProvider;
};

/**
 * Get the pool reserves incentives data using rpc
 * @param lendingPoolAddressProvider The lending pool address provider address
 */
export const getPoolIncentivesRPC = async (
  lendingPoolAddressProvider
): Promise<ReserveIncentivesData[]> => {
  const uiIncentiveProvider = getPoolIncentivesDataProvider();

  // TODO: case there for other params?
  const rawReservesIncentives: ReservesIncentiveDataHumanized[] =
    await uiIncentiveProvider.getReservesIncentivesDataHumanized({ lendingPoolAddressProvider });

  return rawReservesIncentives;
};

export const getUserPoolIncentivesRPC = async (
  lendingPoolAddressProvider: string,
  userAddress: string
): Promise<UserIncentivesData[]> => {
  const uiIncentiveProvider = getPoolIncentivesDataProvider();

  const rawUserReservesIncenvites: UserReservesIncentivesDataHumanized[] =
    await uiIncentiveProvider.getUserReservesIncentivesDataHumanized({
      user: userAddress,
      lendingPoolAddressProvider,
    });

  return rawUserReservesIncenvites;
};
