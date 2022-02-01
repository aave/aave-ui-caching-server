import {
  ReservesDataHumanized,
  UiPoolDataProvider,
  UiPoolDataProviderContext,
  UiPoolDataProviderInterface,
  UserReserveDataHumanized,
} from '@aave/contract-helpers';
import { CONFIG, CHAIN_ID } from '../../config';
import { ProtocolData } from '../../graphql/object-types/reserve';
import { UserReserveData, UserReservesData } from '../../graphql/object-types/user-reserve';
import { ethereumProvider } from '../../helpers/ethereum';

let uiPoolDataProvider: UiPoolDataProviderInterface;

export const getPoolDataProvider = (): UiPoolDataProviderInterface => {
  if (!uiPoolDataProvider) {
    const uiPoolDataProviderConfig: UiPoolDataProviderContext = {
      uiPoolDataProviderAddress: CONFIG.POOL_UI_DATA_PROVIDER_ADDRESS,
      provider: ethereumProvider,
      chainId: CHAIN_ID,
    };
    uiPoolDataProvider = new UiPoolDataProvider(uiPoolDataProviderConfig);
  }
  return uiPoolDataProvider;
};

/**
 * Get the protocol data using rpc
 * @param lendingPoolAddressProvider The pool address
 */
export const getProtocolDataRPC = async (
  lendingPoolAddressProvider: string
): Promise<ProtocolData> => {
  const uiPoolProvider = getPoolDataProvider();
  const { reservesData, baseCurrencyData }: ReservesDataHumanized =
    await uiPoolProvider.getReservesHumanized({ lendingPoolAddressProvider });

  return {
    reserves: reservesData,
    baseCurrencyData,
  };
};

/**
 * Get the user data using rpc
 * @param lendingPoolAddressProvider The pool address
 * @param userAddress The user address
 */
export const getProtocolUserDataRPC = async (
  lendingPoolAddressProvider: string,
  userAddress: string
): Promise<UserReservesData> => {
  const uiPoolProvider = getPoolDataProvider();
  const {
    userReserves: userReservesUnfiltered,
    userEmodeCategoryId,
  }: { userReserves: UserReserveDataHumanized[]; userEmodeCategoryId: number } =
    await uiPoolProvider.getUserReservesHumanized({
      lendingPoolAddressProvider,
      user: userAddress,
    });

  const userReservesFiltered: UserReserveData[] = userReservesUnfiltered.filter(
    (userReserve) =>
      userReserve.scaledATokenBalance !== '0' ||
      userReserve.scaledVariableDebt !== '0' ||
      userReserve.principalStableDebt !== '0'
  );

  return { userReserves: userReservesFiltered, userEmodeCategoryId };
};
