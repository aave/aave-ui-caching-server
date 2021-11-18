import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ReserveIncentivesData } from './graphql/object-types/incentives';
import { ProtocolData } from './graphql/object-types/reserve';
import { getRedis } from './redis/shared';

export enum Topics {
  PROTOCOL_DATA_UPDATE = 'PROTOCOL_DATA_UPDATE',
  USER_DATA_UPDATE = 'USER_DATA_UPDATE',
  INCENTIVES_DATA_UPDATE = 'INCENTIVES_DATA_UPDATE',
  USER_INCENTIVES_DATA_UPDATE = 'USER_INCENTIVES_DATA_UPDATE',
  STAKE_USER_UI_DATA = 'STAKE_USER_UI_DATA',
  STAKE_GENERAL_UI_DATA = 'STAKE_GENERAL_UI_DATA',
}

const pubSub = new RedisPubSub({
  publisher: getRedis(),
  subscriber: getRedis(),
});

export const getPubSub = () => pubSub;

export interface IncentivesDataPayload {
  lendingPoolAddressProvider: string;
  incentivesData: ReserveIncentivesData[];
}

export const pushUpdatedPoolIncentivesDataToSubscriptions = async (
  lendingPoolAddressProvider: string,
  incentivesData: ReserveIncentivesData[]
) =>
  await pubSub.publish<IncentivesDataPayload>(Topics.INCENTIVES_DATA_UPDATE, {
    lendingPoolAddressProvider,
    incentivesData,
  });

export interface UserIncentivesDataPayload {
  lendingPoolAddressProvider: string;
  userAddress: string;
}

export const pushUpdatedUserPoolIncentivesDataToSubscriptions = async (
  lendingPoolAddressProvider: string,
  userAddress: string
) =>
  await pubSub.publish<UserIncentivesDataPayload>(Topics.USER_INCENTIVES_DATA_UPDATE, {
    lendingPoolAddressProvider,
    userAddress,
  });

export interface ProtocolDataPayload {
  lendingPoolAddressProvider: string;
  protocolData: ProtocolData;
}

export const pushUpdatedReserveDataToSubscriptions = async (
  lendingPoolAddressProvider: string,
  protocolData: ProtocolData
) =>
  await pubSub.publish<ProtocolDataPayload>(Topics.PROTOCOL_DATA_UPDATE, {
    lendingPoolAddressProvider,
    protocolData,
  });

export interface UserDataPayload {
  lendingPoolAddressProvider: string;
  userAddress: string;
}
export const pushUpdatedUserReserveDataToSubscriptions = async (
  lendingPoolAddressProvider: string,
  userAddress: string
) =>
  await pubSub.publish<UserDataPayload>(Topics.USER_DATA_UPDATE, {
    lendingPoolAddressProvider,
    userAddress,
  });

export interface StakeUserUIDataPayload {
  userAddress: string;
}
export const pushUpdatedStakeUserUIDataToSubscriptions = async (userAddress: string) =>
  await pubSub.publish<StakeUserUIDataPayload>(Topics.STAKE_USER_UI_DATA, {
    userAddress,
  });

export const pushUpdatedStakeGeneralUIDataToSubscriptions = async () =>
  await pubSub.publish(Topics.STAKE_GENERAL_UI_DATA, {});
