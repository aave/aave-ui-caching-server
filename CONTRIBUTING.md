# Contributing

## How to run

```bash
docker-compose up
```

## How to access the data

[http://localhost:3000/graphql](http://localhost:3000/graphql) - to query data via graphql

[ws://localhost:3000/graphql](ws://localhost:3000/graphql) - for subscription

## Environment parameters

### General

    PORT - the port for the api, default 3000
    REDIS_HOST - key-value storage url, default - "redis"

### Network and pools

    NETWORK - the blockchain network name
    PROTOCOL_ADDRESSES_PROVIDER_ADDRESSES - the list of the pool addresses providers to support, splitted by comma
    POOL_UI_DATA_PROVIDER_ADDRESS - data aggregation helper contract address
    PROTOCOLS_WITH_INCENTIVES_ADDRESSES - the subset of the list of pool addresses providers which has incentives program, if any
    AAVE_TOKEN_ADDRESS - the address of the AAVE token (optional)
    ABPT_TOKEN - the address of the AAVE/ETH balancer pool token (optional)
    STK_AAVE_TOKEN_ADDRESS - the address of the STK AAVE token (optional)
    STK_ABPT_TOKEN_ADDRESS - the address of the STK AAVE/ETH balancer pool token (optional)
    STAKE_DATA_PROVIDER - The address of the stake helper data provider (optional)
    STAKE_DATA_POOLING_INTERVAL - The interval between stake data pooling (optional`)
    RPC_URL - JSON RPC endpoint url to access the data
    RPC_MAX_TIMEOUT - The maximum timeout in seconds for the RPC calls until it tries to use backup nodes
    BACKUP_RPC_URLS - A list of the backup nodes to use if the main goes down, splitted by comma

### Pooling

    STAKE_DATA_POOLING_INTERVAL - The interval in seconds between stake data pooling
    GENERAL_RESERVES_DATA_POOLING_INTERVAL - pooling interval for the general pool data updates, in seconds, default value - 1
    BLOCK_NUMBER_POOLING_INTERVAL - pooling interval for the block number updates, in seconds, default value - 1
    USERS_DATA_POOLING_INTERVAL - pooling interval for the users data updates, in seconds, default value - 1

## Testing

We have high coverage on this repo due. To run tests run:

```bash
$ npm test
```

Any new tasks, endpoints or services added should be tested.
