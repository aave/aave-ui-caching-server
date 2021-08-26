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
import { StakeUserUIDataPayload, Topics } from '../../pubsub';
import { getStakeGeneralUIData, getStakeUserUIData } from '../../services/stake-data';
import { StakeGeneralUIData } from '../object-types/stake-general-data';
import { StakeUserUIData } from '../object-types/stake-user-data';
import { IsEthAddress } from '../validators';

@ArgsType()
class UserArgs {
  @Field()
  @IsEthAddress()
  userAddress: string;
}

@Resolver()
export class StakeDataResolver {
  @Query(() => StakeUserUIData)
  async stakeUserUIData(
    @Args()
    { userAddress }: UserArgs
  ): Promise<StakeUserUIData> {
    return getStakeUserUIData(userAddress);
  }

  @Subscription(() => StakeUserUIData, {
    topics: Topics.STAKE_USER_UI_DATA,
    filter: ({ payload, args }: ResolverFilterData<StakeUserUIDataPayload, UserArgs>) =>
      payload.userAddress.toLowerCase() === args.userAddress.toLowerCase(),
  })
  async stakeUserUIDataUpdate(
    @Root() { userAddress }: StakeUserUIDataPayload,
    @Args() args: UserArgs
  ): Promise<StakeUserUIData> {
    return getStakeUserUIData(userAddress, true);
  }

  @Query(() => StakeGeneralUIData)
  async stakeGeneralUIData(): Promise<StakeGeneralUIData> {
    return getStakeGeneralUIData();
  }

  @Subscription(() => StakeGeneralUIData, {
    topics: Topics.STAKE_GENERAL_UI_DATA,
  })
  async stakeGeneralUIDataUpdate(): Promise<StakeGeneralUIData> {
    return getStakeGeneralUIData();
  }
}
