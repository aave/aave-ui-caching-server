import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ProtocolData } from './graphql/object-types/reserve';
import { getRedis } from './redis/shared';

export enum Topics {
  PROTOCOL_DATA_UPDATE = 'PROTOCOL_DATA_UPDATE',
  USER_DATA_UPDATE = 'USER_DATA_UPDATE',
  STAKE_USER_UI_DATA = 'STAKE_USER_UI_DATA',
  STAKE_GENERAL_UI_DATA = 'STAKE_GENERAL_UI_DATA',
}

const pubSub = new RedisPubSub({
  publisher: getRedis(),
  subscriber: getRedis(),
});

export const getPubSub = () => pubSub;

export interface ProtocolDataPayload {
  poolAddress: string;
  protocolData: ProtocolData;
}

export const pushUpdatedReserveDataToSubscriptions = async (
  poolAddress: string,
  protocolData: ProtocolData
) =>
  await pubSub.publish<ProtocolDataPayload>(Topics.PROTOCOL_DATA_UPDATE, {
    poolAddress,
    protocolData,
  });

export interface UserDataPayload {
  poolAddress: string;
  userAddress: string;
}
export const pushUpdatedUserReserveDataToSubscriptions = async (
  poolAddress: string,
  userAddress: string
) =>
  await pubSub.publish<UserDataPayload>(Topics.USER_DATA_UPDATE, {
    poolAddress,
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
