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
import { UserData } from '../object-types/user-reserve';
import { IsEthAddress } from '../validators';

@ArgsType()
class ProtocolArgs {
  @Field()
  @IsEthAddress()
  poolAddress: string;
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
  async protocolData(@Args() { poolAddress }: ProtocolArgs): Promise<ProtocolData> {
    return getProtocolData(poolAddress);
  }

  @Subscription(() => ProtocolData, {
    topics: Topics.PROTOCOL_DATA_UPDATE,
    filter: ({ payload, args }: ResolverFilterData<ProtocolDataPayload, ProtocolArgs>) =>
      payload.poolAddress.toLowerCase() === args.poolAddress.toLowerCase(),
  })
  async protocolDataUpdate(
    @Root() data: ProtocolDataPayload,
    @Args() args: ProtocolArgs
  ): Promise<ProtocolData> {
    return data.protocolData;
  }

  @Query(() => UserData)
  async userData(
    @Args()
    { userAddress, poolAddress }: UserArgs
  ): Promise<UserData> {
    return getProtocolUserData(poolAddress, userAddress);
  }

  @Subscription(() => UserData, {
    topics: Topics.USER_DATA_UPDATE,
    filter: ({ payload, args }: ResolverFilterData<UserDataPayload, UserArgs>) =>
      payload.poolAddress.toLowerCase() === args.poolAddress.toLowerCase() &&
      payload.userAddress.toLowerCase() === args.userAddress.toLowerCase(),
  })
  async userDataUpdate(
    @Root() { userAddress, poolAddress }: UserDataPayload,
    @Args() args: UserArgs
  ): Promise<UserData> {
    return getProtocolUserData(poolAddress, userAddress, false);
  }
}
