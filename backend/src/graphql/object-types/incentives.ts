import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class RewardInfo {
  @Field()
  rewardTokenSymbol: string;

  @Field()
  rewardTokenAddress: string;

  @Field()
  rewardOracleAddress: string;

  @Field()
  emissionPerSecond: string;

  @Field()
  incentivesLastUpdateTimestamp: number;

  @Field()
  tokenIncentivesIndex: string;

  @Field()
  emissionEndTimestamp: number;

  @Field()
  rewardPriceFeed: string;

  @Field()
  rewardTokenDecimals: number;

  @Field()
  precision: number;

  @Field()
  priceFeedDecimals: number;
}

@ObjectType()
export class IncentiveData {
  @Field()
  tokenAddress: string;

  @Field()
  incentiveControllerAddress: string;

  @Field(() => [RewardInfo])
  rewardsTokenInformation: RewardInfo[];
}

@ObjectType()
export class ReserveIncentivesData {
  @Field()
  underlyingAsset: string;

  @Field(() => IncentiveData)
  aIncentiveData: IncentiveData;

  @Field(() => IncentiveData)
  vIncentiveData: IncentiveData;

  @Field(() => IncentiveData)
  sIncentiveData: IncentiveData;
}
