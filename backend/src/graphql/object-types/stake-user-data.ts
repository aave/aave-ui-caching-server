import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class StakeUserData {
  @Field()
  stakeTokenUserBalance: string;

  @Field()
  underlyingTokenUserBalance: string;

  @Field()
  userCooldown: number;

  @Field()
  userIncentivesToClaim: string;

  @Field()
  userPermitNonce: string;
}

@ObjectType()
export class StakeUserUIData {
  @Field(() => StakeUserData)
  aave: StakeUserData;

  @Field(() => StakeUserData)
  bpt: StakeUserData;

  @Field()
  usdPriceEth: string;
}
