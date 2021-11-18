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
  stableBorrowRate: string;

  @Field()
  principalStableDebt: string;

  @Field()
  stableBorrowLastUpdateTimestamp: number;
}
