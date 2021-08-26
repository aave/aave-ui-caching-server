import { mainNodeReconnectionSettings } from './main-node-reconnection-settings';

export interface BaseProviderContext {
  selectedNode: string;
  backupNodes: string[];
  maxTimout?: number | undefined;
  mainNodeReconnectionSettings?: mainNodeReconnectionSettings[] | undefined;
}
