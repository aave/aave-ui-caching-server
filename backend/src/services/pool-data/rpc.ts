import { ProtocolData, ReserveData } from '../../graphql/object-types/reserve';
import { UserData, UserReserveData } from '../../graphql/object-types/user-reserve';
import IUiPoolDataProvider from './contract';

/**
 * Get the protocol data using rpc
 * @param poolAddress The pool address
 */
export const getProtocolDataRPC = async (poolAddress: string): Promise<ProtocolData> => {
  const {
    0: rawReservesData,
    1: rawUsdPriceEth,
    2: rawEmissionEndTimestamp,
  } = await IUiPoolDataProvider.getSimpleReservesData(poolAddress);

  const reserves: ReserveData[] = rawReservesData.map((rawReserve) => ({
    id: (rawReserve.underlyingAsset + poolAddress).toLowerCase(),
    symbol: rawReserve.symbol.toUpperCase(),
    name: rawReserve.name,
    decimals: rawReserve.decimals.toNumber(),
    underlyingAsset: rawReserve.underlyingAsset.toLowerCase(),
    isActive: rawReserve.isActive,
    isFrozen: rawReserve.isFrozen,
    usageAsCollateralEnabled: rawReserve.usageAsCollateralEnabled,
    aTokenAddress: rawReserve.aTokenAddress.toLowerCase(),
    stableBorrowRate: rawReserve.stableBorrowRate.toString(),
    stableBorrowRateEnabled: rawReserve.stableBorrowRateEnabled,
    stableDebtTokenAddress: rawReserve.stableDebtTokenAddress.toLowerCase(),
    variableDebtTokenAddress: rawReserve.variableDebtTokenAddress.toLowerCase(),
    borrowingEnabled: rawReserve.borrowingEnabled,
    reserveFactor: rawReserve.reserveFactor.toString(),
    baseLTVasCollateral: rawReserve.baseLTVasCollateral.toString(),
    optimalUtilisationRate: '', //TODO: UNMOCK
    stableRateSlope1: rawReserve.stableRateSlope1.toString(),
    stableRateSlope2: rawReserve.stableRateSlope2.toString(),
    averageStableRate: rawReserve.averageStableRate.toString(),
    stableDebtLastUpdateTimestamp: rawReserve.stableDebtLastUpdateTimestamp.toNumber(),
    baseVariableBorrowRate: '0', // TODO: UNMOCK
    variableRateSlope1: rawReserve.variableRateSlope1.toString(),
    variableRateSlope2: rawReserve.variableRateSlope2.toString(),
    liquidityIndex: rawReserve.liquidityIndex.toString(),
    reserveLiquidationThreshold: rawReserve.reserveLiquidationThreshold.toString(),
    reserveLiquidationBonus: rawReserve.reserveLiquidationBonus.toString(),
    variableBorrowIndex: rawReserve.variableBorrowIndex.toString(),
    variableBorrowRate: rawReserve.variableBorrowRate.toString(),
    availableLiquidity: rawReserve.availableLiquidity.toString(),
    liquidityRate: rawReserve.liquidityRate.toString(),
    totalPrincipalStableDebt: rawReserve.totalPrincipalStableDebt.toString(),
    totalScaledVariableDebt: rawReserve.totalScaledVariableDebt.toString(),
    lastUpdateTimestamp: rawReserve.lastUpdateTimestamp,
    price: { priceInEth: rawReserve.priceInEth.toString() },
    aEmissionPerSecond: rawReserve.aEmissionPerSecond.toString(),
    vEmissionPerSecond: rawReserve.vEmissionPerSecond.toString(),
    sEmissionPerSecond: rawReserve.sEmissionPerSecond.toString(),
    aIncentivesLastUpdateTimestamp: rawReserve.aIncentivesLastUpdateTimestamp.toNumber(),
    vIncentivesLastUpdateTimestamp: rawReserve.vIncentivesLastUpdateTimestamp.toNumber(),
    sIncentivesLastUpdateTimestamp: rawReserve.sIncentivesLastUpdateTimestamp.toNumber(),
    aTokenIncentivesIndex: rawReserve.aTokenIncentivesIndex.toString(),
    vTokenIncentivesIndex: rawReserve.vTokenIncentivesIndex.toString(),
    sTokenIncentivesIndex: rawReserve.sTokenIncentivesIndex.toString(),
  }));

  return {
    reserves,
    usdPriceEth: rawUsdPriceEth.toString(),
    emissionEndTimestamp: rawEmissionEndTimestamp.toNumber(),
  };
};

/**
 * Get the user data using rpc
 * @param poolAddress The pool address
 * @param userAddress The user address
 */
export const getProtocolUserDataRPC = async (
  poolAddress: string,
  userAddress: string
): Promise<UserData> => {
  const { 0: rawUserReserves, 1: rawUserUnclaimedRewards } =
    await IUiPoolDataProvider.getUserReservesData(poolAddress, userAddress);
  const userReserves: UserReserveData[] = rawUserReserves
    .filter(
      (rawUserReserve) =>
        !rawUserReserve.scaledATokenBalance.isZero() ||
        !rawUserReserve.scaledVariableDebt.isZero() ||
        !rawUserReserve.principalStableDebt.isZero()
    )
    .map((rawUserReserve) => {
      return {
        underlyingAsset: rawUserReserve.underlyingAsset.toLowerCase(),
        scaledATokenBalance: rawUserReserve.scaledATokenBalance.toString(),
        usageAsCollateralEnabledOnUser: rawUserReserve.usageAsCollateralEnabledOnUser,
        scaledVariableDebt: rawUserReserve.scaledVariableDebt.toString(),
        stableBorrowRate: rawUserReserve.stableBorrowRate.toString(),
        principalStableDebt: rawUserReserve.principalStableDebt.toString(),
        variableBorrowIndex: '0', //TODO: should be removed after lib update
        stableBorrowLastUpdateTimestamp: rawUserReserve.stableBorrowLastUpdateTimestamp.toNumber(),
        aTokenincentivesUserIndex: rawUserReserve.aTokenincentivesUserIndex.toString(),
        vTokenincentivesUserIndex: rawUserReserve.vTokenincentivesUserIndex.toString(),
        sTokenincentivesUserIndex: rawUserReserve.sTokenincentivesUserIndex.toString(),
      };
    });
  return {
    userReserves,
    userUnclaimedRewards: rawUserUnclaimedRewards.toString(),
  };
};

export const getIncentivesControllerAddressRpc = async (): Promise<string> =>
  IUiPoolDataProvider.incentivesController();
