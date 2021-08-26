import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class StakeGeneralData {
  @Field()
  stakeTokenTotalSupply: string;

  @Field()
  stakeCooldownSeconds: number;

  @Field()
  stakeUnstakeWindow: number;

  @Field()
  stakeTokenPriceEth: string;

  @Field()
  rewardTokenPriceEth: string;

  @Field()
  stakeApy: string;

  @Field()
  distributionPerSecond: string;

  @Field()
  distributionEnd: string;
}

@ObjectType()
export class StakeGeneralUIData {
  @Field(() => StakeGeneralData)
  aave: StakeGeneralData;

  @Field(() => StakeGeneralData)
  bpt: StakeGeneralData;

  @Field()
  usdPriceEth: string;
}
