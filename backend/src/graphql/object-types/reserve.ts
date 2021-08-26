import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class PriceData {
  @Field()
  priceInEth: string;
}

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
  optimalUtilisationRate: string;

  @Field()
  stableRateSlope1: string;

  @Field()
  stableRateSlope2: string;

  @Field()
  averageStableRate: string;

  @Field()
  stableDebtLastUpdateTimestamp: number;

  @Field()
  baseVariableBorrowRate: string;

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
  aEmissionPerSecond: string;

  @Field()
  vEmissionPerSecond: string;

  @Field()
  sEmissionPerSecond: string;

  @Field()
  aIncentivesLastUpdateTimestamp: number;

  @Field()
  vIncentivesLastUpdateTimestamp: number;

  @Field()
  sIncentivesLastUpdateTimestamp: number;

  @Field()
  aTokenIncentivesIndex: string;

  @Field()
  vTokenIncentivesIndex: string;

  @Field()
  sTokenIncentivesIndex: string;

  @Field(() => PriceData)
  price: PriceData;
}

@ObjectType()
export class ProtocolData {
  @Field(() => [ReserveData])
  reserves: ReserveData[];

  @Field()
  usdPriceEth: string;

  @Field()
  emissionEndTimestamp: number;
}
