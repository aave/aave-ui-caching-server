import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { ethers, providers, utils } from 'ethers';
import { RPC_URL } from '../config';
import { getBlockNumberRedis } from '../redis';

// too much too soon ;)! we will roll this in once happy
// with other changes
// export const ethereumProvider = generate({
//   selectedNode: RPC_URL,
//   backupNodes: BACKUP_RPC_URLS,
//   maxTimout: RPC_MAX_TIMEOUT,
// });

export const ethereumProvider = new providers.StaticJsonRpcProvider(RPC_URL);

export const alchemyWeb3Provider = createAlchemyWeb3(RPC_URL);

export async function getBlockNumber(useCache = true): Promise<number> {
  let blockNumberStr: string;

  if (useCache) {
    try {
      blockNumberStr = await getBlockNumberRedis();
    } catch (e) {}

    if (blockNumberStr) {
      return Number(blockNumberStr);
    }
  }

  return await getBlockNumberRpc();
}

export const getBlockNumberRpc = async (): Promise<number> => {
  try {
    return await ethereumProvider.getBlockNumber();
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const getUsersFromLogs = async (
  reservesList: string[],
  fromBlock: number,
  toBlock: number,
  topics: string[] = ['Transfer(address,address,uint256)']
): Promise<string[]> => {
  if (reservesList.length === 0) return [];
  const rawLogs = await alchemyWeb3Provider.eth.getPastLogs({
    fromBlock,
    toBlock,
    topics: topics.map((t) => utils.id(t)),
    address: reservesList,
  });
  const users: string[] = [];
  rawLogs.forEach((data) => {
    const logs = alchemyWeb3Provider.eth.abi.decodeLog(
      [
        {
          type: 'address',
          name: 'from',
          indexed: true,
        },
        {
          type: 'address',
          name: 'to',
          indexed: true,
        },
      ],
      '',
      [data.topics[1], data.topics[2]]
    );
    if (canPushIntoUser(users, logs.from)) {
      users.push(logs.from);
    }
    if (canPushIntoUser(users, logs.to)) {
      users.push(logs.to);
    }
  });
  return users;
};

// can be 2 in the same block!
const canPushIntoUser = (users: string[], address: string) =>
  address !== ethers.constants.AddressZero && !users.find((c) => c === address);
