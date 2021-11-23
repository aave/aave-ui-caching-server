import { STAKING_CONFIG } from '../config';
import { getBlockNumber } from '../helpers/ethereum';
import { sleep } from '../helpers/utils';
import * as lastSeenBlockState from './last-seen-block.state';

interface RunTaskContext {
  runEvery: number;
  startupHandler?: any;
  mainHandler: () => void;
  runningHandler: () => boolean;
}

export async function runTask(context: RunTaskContext) {
  if (context.startupHandler) {
    await context.startupHandler();
  }

  while (true) {
    if (!context.runningHandler()) {
      console.log('Job has been stopped');
      break;
    }
    await context.mainHandler();
    await sleep(context.runEvery);
  }
}

export interface BlockContext {
  currentBlock: number;
  lastSeenBlock: number;
  shouldExecute: boolean;
  commit: () => void; // to sync the lastSeen and current on the local state
}

export async function getBlockContext(key: string, useCache = true): Promise<BlockContext> {
  const currentBlock = await getBlockNumber(useCache);
  const lastSeenBlock = lastSeenBlockState.get(key);
  if (currentBlock > lastSeenBlock) {
    console.log('new block number seen', {
      lastSeenBlock,
      currentBlock,
      date: new Date(),
    });
  }

  return {
    currentBlock,
    lastSeenBlock,
    shouldExecute: currentBlock > lastSeenBlock,
    commit: () => lastSeenBlockState.update(key, currentBlock),
  };
}

export function isStakeEnabled(): boolean {
  return !!STAKING_CONFIG;
}
