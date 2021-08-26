import * as ethersUtils from 'ethers/lib/utils';
import { BACKUP_RPC_URLS, RPC_MAX_TIMEOUT, RPC_URL } from '../../src/config';
import { generate } from '../../src/custom-provider/aave-provider-manager';

jest.mock('ethers/lib/utils', () => ({
  __esModule: true,
  fetchJson: jest.fn().mockImplementation(() => Promise.resolve('0x01')),
}));

const buildNoBackupDefaultProvider = generate({
  selectedNode: RPC_URL,
  backupNodes: BACKUP_RPC_URLS,
  maxTimout: RPC_MAX_TIMEOUT,
});

const buildBackupDefaultProvider = generate({
  selectedNode: RPC_URL,
  backupNodes: ['BACKUP_NODE'],
  maxTimout: RPC_MAX_TIMEOUT,
});

const buildUsingBackupDefaultProvider = (
  mainNodeReconnectionContext: {
    reconnectAttempts: number;
    lastAttempted: number;
  } = undefined
) => {
  return generate({
    selectedNode: 'BACKUP_NODE',
    // @ts-ignore
    alreadyUsedNodes: [{ node: RPC_URL, wasMainNode: true }],
    mainNode: RPC_URL,
    mainNodeReconnectionContext,
    backupNodes: [],
    maxTimout: RPC_MAX_TIMEOUT,
  });
};

describe('AaveCustomProvider', () => {
  beforeEach(() => {
    jest
      .spyOn(ethersUtils, 'fetchJson')
      .mockImplementation(() => Promise.resolve({ result: '0x01' }));
  });
  describe('send', () => {
    it('should send jsonrpc message correctly', async () => {
      const result = await buildNoBackupDefaultProvider.send('eth_blockNumber', []);

      expect(result).not.toBeUndefined();
    });

    it('should call fetch from ethers utils', async () => {
      const spy = jest.spyOn(ethersUtils, 'fetchJson');
      await buildNoBackupDefaultProvider.send('eth_blockNumber', []);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('if fetch throws a valid node error throw error', async () => {
      const spy = jest.spyOn(ethersUtils, 'fetchJson').mockImplementation(() => {
        throw new Error('NODE_ERROR');
      });
      await expect(buildNoBackupDefaultProvider.send('eth_blockNumber', [])).rejects.toThrow(
        'NODE_ERROR'
      );

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('if fetch throws a invalid node error it should try to switch nodes but throw that error if it can not find any nodes to switch to', async () => {
      const spy = jest.spyOn(ethersUtils, 'fetchJson').mockImplementation(() => {
        throw new Error('missing response');
      });
      await expect(buildNoBackupDefaultProvider.send('eth_blockNumber', [])).rejects.toThrow(
        'missing response'
      );

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('if fetch throws a invalid node error it should switch nodes successfully', async () => {
      const spy = jest.spyOn(ethersUtils, 'fetchJson').mockImplementationOnce(() => {
        throw new Error('missing response');
      });
      const result = await buildBackupDefaultProvider.send('eth_blockNumber', []);

      expect(result).not.toBeUndefined();
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should not switch back to main node if it mainNodeReconnectionContext is not defined', async () => {
      const spy = jest.spyOn(ethersUtils, 'fetchJson');

      const result = await buildUsingBackupDefaultProvider().send('eth_blockNumber', []);
      expect(result).not.toBeUndefined();
      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(spy.mock.calls[0][0].url).toEqual('BACKUP_NODE');
    });

    it('should switch back to main node if it hits the config requirements first threshold', async () => {
      const spy = jest.spyOn(ethersUtils, 'fetchJson');

      const result = await buildUsingBackupDefaultProvider({
        reconnectAttempts: 5,
        lastAttempted: 0,
      }).send('eth_blockNumber', []);
      expect(result).not.toBeUndefined();
      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(spy.mock.calls[0][0].url).toEqual(RPC_URL);
    });

    it('should switch back to main node if it hits the config requirements second threshold', async () => {
      const spy = jest.spyOn(ethersUtils, 'fetchJson');

      const result = await buildUsingBackupDefaultProvider({
        reconnectAttempts: 6,
        lastAttempted: 0,
      }).send('eth_blockNumber', []);
      expect(result).not.toBeUndefined();
      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(spy.mock.calls[0][0].url).toEqual(RPC_URL);
    });

    it('should switch back to main node if it hits the config requirements thrid threshold', async () => {
      const spy = jest.spyOn(ethersUtils, 'fetchJson');

      const result = await buildUsingBackupDefaultProvider({
        reconnectAttempts: 11,
        lastAttempted: 0,
      }).send('eth_blockNumber', []);
      expect(result).not.toBeUndefined();
      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(spy.mock.calls[0][0].url).toEqual(RPC_URL);
    });

    it('should switch back to main node if it hits the config requirements fourth threshold', async () => {
      const spy = jest.spyOn(ethersUtils, 'fetchJson');

      const result = await buildUsingBackupDefaultProvider({
        reconnectAttempts: 21,
        lastAttempted: 0,
      }).send('eth_blockNumber', []);
      expect(result).not.toBeUndefined();
      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(spy.mock.calls[0][0].url).toEqual(RPC_URL);
    });

    it('should switch back to main node if it hits the config requirements fifth threshold', async () => {
      const spy = jest.spyOn(ethersUtils, 'fetchJson');

      const result = await buildUsingBackupDefaultProvider({
        reconnectAttempts: Infinity,
        lastAttempted: 0,
      }).send('eth_blockNumber', []);
      expect(result).not.toBeUndefined();
      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(spy.mock.calls[0][0].url).toEqual(RPC_URL);
    });
  });

  describe('getResult', () => {
    it('should throw error if payload has error in', () => {
      expect(() => {
        // @ts-ignore
        buildNoBackupDefaultProvider.getResult({ error: { message: 'blah' } });
      }).toThrowError('blah');
    });

    it('should return result if no error present', () => {
      // @ts-ignore
      const results = buildNoBackupDefaultProvider.getResult({ result: '0x01' });
      expect(results).toBe('0x01');
    });
  });
});
