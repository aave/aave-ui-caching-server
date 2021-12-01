import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserRewardInfo {
  @Field()
  rewardTokenSymbol: string;

  @Field()
  rewardOracleAddress: string;

  @Field()
  rewardTokenAddress: string;

  @Field()
  userUnclaimedRewards: string;

  @Field()
  tokenIncentivesUserIndex: string;

  @Field()
  rewardPriceFeed: string;

  @Field()
  priceFeedDecimals: number;

  @Field()
  rewardTokenDecimals: number;
}

@ObjectType()
export class UserIncentiveData {
  @Field()
  tokenAddress: string;

  @Field()
  incentiveControllerAddress: string;

  @Field(() => [UserRewardInfo])
  userRewardsInformation: UserRewardInfo[];
}

@ObjectType()
export class UserIncentivesData {
  @Field()
  underlyingAsset: string;

  @Field(() => UserIncentiveData)
  aTokenIncentivesUserData: UserIncentiveData;

  @Field(() => UserIncentiveData)
  vTokenIncentivesUserData: UserIncentiveData;

  @Field(() => UserIncentiveData)
  sTokenIncentivesUserData: UserIncentiveData;
}
