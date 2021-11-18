import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class TokenIncentivesUserData {
  @Field()
  tokenIncentivesUserIndex: string;

  @Field()
  userUnclaimedRewards: string;

  @Field()
  tokenAddress: string;

  @Field()
  rewardTokenAddress: string;

  @Field()
  rewardTokenDecimals: number;

  @Field()
  incentiveControllerAddress: string;
}

@ObjectType()
export class UserIncentivesData {
  @Field()
  underlyingAsset: string;

  @Field(() => TokenIncentivesUserData)
  aTokenIncentivesUserData: TokenIncentivesUserData;

  @Field(() => TokenIncentivesUserData)
  vTokenIncentivesUserData: TokenIncentivesUserData;

  @Field(() => TokenIncentivesUserData)
  sTokenIncentivesUserData: TokenIncentivesUserData;
}
