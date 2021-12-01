import { BACKUP_RPC_URLS, RPC_MAX_TIMEOUT, CONFIG, STAKING_CONFIG } from '../src/config';

describe('config - only tests on environment variables which parse to something else', () => {
  it('PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES should return an array', () => {
    expect(CONFIG.PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES).toBeInstanceOf(Array);
    expect(CONFIG.PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES).toHaveLength(2);
  });

  it('BACKUP_RPC_URLS should return an array', () => {
    expect(BACKUP_RPC_URLS).toBeInstanceOf(Array);
    expect(BACKUP_RPC_URLS).toHaveLength(0);
  });

  it('RPC_MAX_TIMEOUT should return a number', () => {
    expect(RPC_MAX_TIMEOUT).toEqual(1000);
  });

  it('STAKE_DATA_POOLING_INTERVAL should return a number', () => {
    expect(STAKING_CONFIG.STAKE_DATA_POOLING_INTERVAL).toEqual(1000);
  });

  it('BLOCK_NUMBER_POOLING_INTERVAL should return a number', () => {
    expect(CONFIG.BLOCK_NUMBER_POOLING_INTERVAL).toEqual(1000);
  });

  it('GENERAL_RESERVES_DATA_POOLING_INTERVAL should return a number', () => {
    expect(CONFIG.GENERAL_RESERVES_DATA_POOLING_INTERVAL).toEqual(5000);
  });

  it('USERS_DATA_POOLING_INTERVAL should return a number', () => {
    expect(CONFIG.USERS_DATA_POOLING_INTERVAL).toEqual(5000);
  });
});
