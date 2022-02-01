import {
  Args,
  ArgsType,
  Field,
  Query,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
  Int,
} from 'type-graphql';
import { IncentivesDataPayload, Topics, UserIncentivesDataPayload } from '../../pubsub';
import { getPoolIncentives, getUserPoolIncentives } from '../../services/incentives-data';
import { ReserveIncentivesData } from '../object-types/incentives';
import { UserIncentivesData } from '../object-types/user-incentives';
import { IsEthAddress } from '../validators';

@ArgsType()
class PoolArgs {
  @Field()
  @IsEthAddress()
  lendingPoolAddressProvider: string;

  @Field((type) => Int)
  chainId: number;
}

@ArgsType()
class UserArgs extends PoolArgs {
  @Field()
  @IsEthAddress()
  userAddress: string;
}

@Resolver()
export class IncentivesDataResolver {
  @Query(() => [ReserveIncentivesData])
  async reservesIncentives(
    @Args() { lendingPoolAddressProvider }: PoolArgs
  ): Promise<ReserveIncentivesData[]> {
    return getPoolIncentives(lendingPoolAddressProvider);
  }

  @Subscription(() => [ReserveIncentivesData], {
    topics: Topics.INCENTIVES_DATA_UPDATE,
    filter: ({ payload, args }: ResolverFilterData<IncentivesDataPayload, PoolArgs>) =>
      payload.lendingPoolAddressProvider.toLowerCase() ===
      args.lendingPoolAddressProvider.toLowerCase(),
  })
  async poolIncentivesDataUpdate(
    @Root() data: IncentivesDataPayload,
    @Args() args: PoolArgs
  ): Promise<ReserveIncentivesData[]> {
    return data.incentivesData;
  }

  @Query(() => [UserIncentivesData])
  async userIncentives(
    @Args() { userAddress, lendingPoolAddressProvider }: UserArgs
  ): Promise<UserIncentivesData[]> {
    return getUserPoolIncentives(lendingPoolAddressProvider, userAddress);
  }

  @Subscription(() => [UserIncentivesData], {
    topics: Topics.USER_INCENTIVES_DATA_UPDATE,
    filter: ({ payload, args }: ResolverFilterData<UserIncentivesDataPayload, UserArgs>) =>
      payload.lendingPoolAddressProvider.toLowerCase() ===
        args.lendingPoolAddressProvider.toLowerCase() &&
      payload.userAddress.toLowerCase() === args.userAddress.toLowerCase(),
  })
  async userPoolIncentivesDataUpdate(
    @Root() { userAddress, lendingPoolAddressProvider }: UserArgs,
    @Args() args: UserArgs
  ): Promise<UserIncentivesData[]> {
    return getUserPoolIncentives(lendingPoolAddressProvider, userAddress);
  }
}
