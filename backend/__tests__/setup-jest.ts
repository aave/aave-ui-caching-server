console.log = jest.fn();
console.error = jest.fn();

jest.mock('../src/redis/shared', () => ({
  __esModule: true,
  getRedis: jest.fn(),
}));

jest.mock('../src/pubsub', () => ({
  __esModule: true,
  getPubSub: jest.fn(),
  pushUpdatedReserveDataToSubscriptions: jest.fn(),
  pushUpdatedUserReserveDataToSubscriptions: jest.fn(),
  pushUpdatedStakeUserDataToSubscriptions: jest.fn(),
  pushUpdatedPoolIncentivesDataToSubscriptions: jest.fn(),
  pushUpdatedUserPoolIncentivesDataToSubscriptions: jest.fn(),
}));

jest.mock('../src/config', () => ({
  __esModule: true,
  REDIS_HOST: 'redis',
  NETWORK: 'mainnet',
  PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES: [
    '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
    '0xacc030ef66f9dfeae9cbb0cd1b25654b82cfa8d5',
  ],
  POOL_UI_DATA_PROVIDER_ADDRESS: '0x47e300dDd1d25447482E2F7e5a5a967EA2DA8634',
  AAVE_TOKEN_ADDRESS: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  ABPT_TOKEN: '0x41A08648C3766F9F9d85598fF102a08f4ef84F84',
  STK_AAVE_TOKEN_ADDRESS: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  STK_ABPT_TOKEN_ADDRESS: '0xa1116930326D21fB917d5A27F1E9943A9595fb47',
  STAKE_DATA_PROVIDER: '0xc57450af527d10Fe182521AB39C1AD23c1e1BaDE',
  UI_INCENTIVE_DATA_PROVIDER_ADDRESS: '0xd9F1e5F70B14b8Fd577Df84be7D75afB8a3A0186',
  STAKE_DATA_POOLING_INTERVAL: 1000,
  BLOCK_NUMBER_POOLING_INTERVAL: 1000,
  RPC_URL: 'https://eth-mainnet.alchemyapi.io/v2/demo',
  RPC_MAX_TIMEOUT: 1000,
  BACKUP_RPC_URLS: [],
  USERS_DATA_POOLING_INTERVAL: 5000,
  GENERAL_RESERVES_DATA_POOLING_INTERVAL: 5000,
  RECOVERY_TIMEOUT: 5000,
  RESERVES_LIST_VALIDITY_INTERVAL: 60 * 5 * 1000,
}));
