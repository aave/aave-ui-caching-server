import { getParam, getParamOrExit } from './env-helpers';

export const REDIS_HOST = getParamOrExit('REDIS_HOST');

export const RPC_URL = getParamOrExit('RPC_URL');
const _BACKUP_RPC_URLS: string | null = getParam('BACKUP_RPC_URLS');
const _parseBackupRpcUrls = (value: string) => {
  if (value.length < 1) {
    return [];
  }
  return value.split(',');
};
export const BACKUP_RPC_URLS =
  _BACKUP_RPC_URLS === null ? [] : _parseBackupRpcUrls(_BACKUP_RPC_URLS);
export const RPC_MAX_TIMEOUT = Number(getParamOrExit('RPC_MAX_TIMEOUT')) * 1000;

export const NETWORK = getParamOrExit('NETWORK');

export const PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES = getParamOrExit(
  'PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES'
)
  .split(',')
  .map((p) => p);

export const PROTOCOLS_WITH_INCENTIVES_ADDRESSES = (
  process.env.PROTOCOLS_WITH_INCENTIVES_ADDRESSES || ''
)
  .split(',')
  .map((p) => p);

export const POOL_UI_DATA_PROVIDER_ADDRESS = getParamOrExit('POOL_UI_DATA_PROVIDER_ADDRESS');

export const AAVE_TOKEN_ADDRESS: string | null = getParam('AAVE_TOKEN_ADDRESS');

export const ABPT_TOKEN: string | null = getParam('ABPT_TOKEN');

export const STK_AAVE_TOKEN_ADDRESS: string | null = getParam('STK_AAVE_TOKEN_ADDRESS');

export const STK_ABPT_TOKEN_ADDRESS: string | null = getParam('STK_ABPT_TOKEN_ADDRESS');

export const STAKE_DATA_PROVIDER: string | null = getParam('STAKE_DATA_PROVIDER');

export const STAKE_DATA_POOLING_INTERVAL: number | null =
  Number(getParam('STAKE_DATA_POOLING_INTERVAL') || 1) * 1000;

export const BLOCK_NUMBER_POOLING_INTERVAL =
  Number(getParam('BLOCK_NUMBER_POOLING_INTERVAL') || 1) * 1000;

export const GENERAL_RESERVES_DATA_POOLING_INTERVAL =
  Number(getParam('GENERAL_RESERVES_DATA_POOLING_INTERVAL') || 3) * 1000;

export const USERS_DATA_POOLING_INTERVAL =
  Number(getParam('USERS_DATA_POOLING_INTERVAL') || 3) * 1000;

export const RECOVERY_TIMEOUT =
  Number(process.env.GENERAL_RESERVES_DATA_POOLING_INTERVAL || 2) * 1000;

export const RESERVES_LIST_VALIDITY_INTERVAL = 60 * 5 * 1000;
