import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserReserveData {
  @Field()
  underlyingAsset: string;

  @Field()
  scaledATokenBalance: string;

  @Field()
  usageAsCollateralEnabledOnUser: boolean;

  @Field()
  scaledVariableDebt: string;

  @Field()
  variableBorrowIndex: string;

  @Field()
  stableBorrowRate: string;

  @Field()
  principalStableDebt: string;

  @Field()
  stableBorrowLastUpdateTimestamp: number;

  @Field()
  aTokenincentivesUserIndex: string;

  @Field()
  vTokenincentivesUserIndex: string;

  @Field()
  sTokenincentivesUserIndex: string;
}

@ObjectType()
export class UserData {
  @Field(() => [UserReserveData])
  userReserves: UserReserveData[];

  @Field()
  userUnclaimedRewards: string;
}
