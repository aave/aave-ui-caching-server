import {
  Denominations,
  ReserveIncentiveWithFeedsResponse,
  UiIncentiveDataProvider,
  UiIncentiveDataProviderContext,
  UiIncentiveDataProviderInterface,
  UserReserveIncentiveDataHumanizedResponse,
} from '@aave/contract-helpers';
import { ethereumProvider } from '../../helpers/ethereum';
import { CONFIG } from '../../config';
import { ReserveIncentivesData } from '../../graphql/object-types/incentives';
import { UserIncentivesData } from '../../graphql/object-types/user-incentives';

let uiIncentiveProvider: UiIncentiveDataProviderInterface;

export type IncentivesRPCType = {
  lendingPoolAddressProvider: string;
  chainlinkFeedsRegistry?: string;
  quote?: Denominations;
};

export const getPoolIncentivesDataProvider = (): UiIncentiveDataProviderInterface => {
  if (!uiIncentiveProvider) {
    const uiIncentiveProviderConfig: UiIncentiveDataProviderContext = {
      incentiveDataProviderAddress: CONFIG.UI_INCENTIVE_DATA_PROVIDER_ADDRESS,
      provider: ethereumProvider,
    };
    uiIncentiveProvider = new UiIncentiveDataProvider(uiIncentiveProviderConfig);
  }
  return uiIncentiveProvider;
};

/**
 * Get the pool reserves incentives data using rpc
 * @param lendingPoolAddressProvider The lending pool address provider address
 */
export const getPoolIncentivesRPC = async ({
  lendingPoolAddressProvider,
  chainlinkFeedsRegistry,
  quote,
}: IncentivesRPCType): Promise<ReserveIncentivesData[]> => {
  const uiIncentiveProvider = getPoolIncentivesDataProvider();

  // TODO: case there for other params?
  const rawReservesIncentives: ReserveIncentiveWithFeedsResponse[] =
    await uiIncentiveProvider.getIncentivesDataWithPrice({
      lendingPoolAddressProvider,
      chainlinkFeedsRegistry,
      quote,
    });

  return rawReservesIncentives;
};

export const getUserPoolIncentivesRPC = async (
  lendingPoolAddressProvider: string,
  userAddress: string
): Promise<UserIncentivesData[]> => {
  const uiIncentiveProvider = getPoolIncentivesDataProvider();

  const rawUserReservesIncenvites: UserReserveIncentiveDataHumanizedResponse[] =
    await uiIncentiveProvider.getUserReservesIncentivesDataHumanized(
      userAddress,
      lendingPoolAddressProvider
    );

  return rawUserReservesIncenvites;
};
