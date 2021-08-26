import { AlreadyUsedNodeContext } from './already-used-node-context';
import { BaseProviderContext } from './base-provider-context';

export interface InternalAaveProviderContext extends BaseProviderContext {
  alreadyUsedNodes: AlreadyUsedNodeContext[];
  mainNode: string;
  mainNodeReconnectionContext?:
    | {
        reconnectAttempts: number;
        lastAttempted: number;
      }
    | undefined;
}
