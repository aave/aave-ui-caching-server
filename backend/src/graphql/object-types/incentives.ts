import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class IncentivesData {
  @Field()
  emissionPerSecond: string;

  @Field()
  incentivesLastUpdateTimestamp: number;

  @Field()
  tokenIncentivesIndex: string;

  @Field()
  emissionEndTimestamp: number;

  @Field()
  tokenAddress: string;

  @Field()
  rewardTokenAddress: string;

  @Field()
  rewardTokenDecimals: number;

  @Field()
  incentiveControllerAddress: string;

  @Field()
  precision: number;

  @Field()
  priceFeed: string;

  @Field()
  priceFeedTimestamp: number;

  @Field()
  priceFeedDecimals: number;
}

@ObjectType()
export class ReserveIncentivesData {
  @Field()
  underlyingAsset: string;

  @Field(() => IncentivesData)
  aIncentiveData: IncentivesData;

  @Field(() => IncentivesData)
  vIncentiveData: IncentivesData;

  @Field(() => IncentivesData)
  sIncentiveData: IncentivesData;
}
