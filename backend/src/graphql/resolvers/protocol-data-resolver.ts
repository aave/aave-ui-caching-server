import {
  Args,
  ArgsType,
  Field,
  Query,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
} from 'type-graphql';
import { ProtocolDataPayload, Topics, UserDataPayload } from '../../pubsub';
import { getProtocolData, getProtocolUserData } from '../../services/pool-data';
import { ProtocolData } from '../object-types/reserve';
import { UserReservesData } from '../object-types/user-reserve';
import { IsEthAddress } from '../validators';

@ArgsType()
class ProtocolArgs {
  @Field()
  @IsEthAddress()
  lendingPoolAddressProvider: string;
}

@ArgsType()
class UserArgs extends ProtocolArgs {
  @Field()
  @IsEthAddress()
  userAddress: string;
}

@Resolver()
export class ProtocolDataResolver {
  @Query(() => ProtocolData)
  async protocolData(@Args() { lendingPoolAddressProvider }: ProtocolArgs): Promise<ProtocolData> {
    return getProtocolData(lendingPoolAddressProvider);
  }

  @Subscription(() => ProtocolData, {
    topics: Topics.PROTOCOL_DATA_UPDATE,
    filter: ({ payload, args }: ResolverFilterData<ProtocolDataPayload, ProtocolArgs>) =>
      payload.lendingPoolAddressProvider.toLowerCase() ===
      args.lendingPoolAddressProvider.toLowerCase(),
  })
  async protocolDataUpdate(
    @Root() data: ProtocolDataPayload,
    @Args() args: ProtocolArgs
  ): Promise<ProtocolData> {
    return data.protocolData;
  }

  @Query(() => UserReservesData)
  async userData(
    @Args()
    { userAddress, lendingPoolAddressProvider }: UserArgs
  ): Promise<UserReservesData> {
    return getProtocolUserData(lendingPoolAddressProvider, userAddress);
  }

  @Subscription(() => UserReservesData, {
    topics: Topics.USER_DATA_UPDATE,
    filter: ({ payload, args }: ResolverFilterData<UserDataPayload, UserArgs>) =>
      payload.lendingPoolAddressProvider.toLowerCase() ===
        args.lendingPoolAddressProvider.toLowerCase() &&
      payload.userAddress.toLowerCase() === args.userAddress.toLowerCase(),
  })
  async userDataUpdate(
    @Root() { userAddress, lendingPoolAddressProvider }: UserDataPayload,
    @Args() args: UserArgs
  ): Promise<UserReservesData> {
    return getProtocolUserData(lendingPoolAddressProvider, userAddress, false);
  }
}
