import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ReserveData {
  @Field()
  id: string;

  @Field()
  underlyingAsset: string;

  @Field()
  name: string;

  @Field()
  symbol: string;

  @Field()
  decimals: number;

  @Field()
  isActive: boolean;

  @Field()
  isFrozen: boolean;

  @Field()
  usageAsCollateralEnabled: boolean;

  @Field()
  aTokenAddress: string;

  @Field()
  stableDebtTokenAddress: string;

  @Field()
  variableDebtTokenAddress: string;

  @Field()
  borrowingEnabled: boolean;

  @Field()
  stableBorrowRateEnabled: boolean;

  @Field()
  reserveFactor: string;

  @Field()
  baseLTVasCollateral: string;

  @Field()
  stableRateSlope1: string;

  @Field()
  stableRateSlope2: string;

  @Field()
  averageStableRate: string;

  @Field()
  stableDebtLastUpdateTimestamp: number;

  @Field()
  variableRateSlope1: string;

  @Field()
  variableRateSlope2: string;

  @Field()
  liquidityIndex: string;

  @Field()
  reserveLiquidationThreshold: string;

  @Field()
  reserveLiquidationBonus: string;

  @Field()
  variableBorrowIndex: string;

  @Field()
  variableBorrowRate: string;

  @Field()
  availableLiquidity: string;

  @Field()
  stableBorrowRate: string;

  @Field()
  liquidityRate: string;

  @Field()
  totalPrincipalStableDebt: string;

  @Field()
  totalScaledVariableDebt: string;

  @Field()
  lastUpdateTimestamp: number;

  @Field()
  priceInMarketReferenceCurrency: string;

  @Field()
  interestRateStrategyAddress: string;
}

@ObjectType()
export class BaseCurrencyData {
  @Field()
  marketReferenceCurrencyDecimals: number;

  @Field()
  marketReferenceCurrencyPriceInUsd: string;

  @Field()
  networkBaseTokenPriceInUsd: string;

  @Field()
  networkBaseTokenPriceDecimals: number;
}

@ObjectType()
export class ProtocolData {
  @Field(() => [ReserveData])
  reserves: ReserveData[];

  @Field(() => BaseCurrencyData)
  baseCurrencyData: BaseCurrencyData;
}
