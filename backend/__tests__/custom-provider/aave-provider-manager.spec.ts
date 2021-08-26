import { BACKUP_RPC_URLS, RPC_MAX_TIMEOUT, RPC_URL } from '../../src/config';
import { AaveCustomProvider } from '../../src/custom-provider/aave-custom-provider';
import { generate } from '../../src/custom-provider/aave-provider-manager';

describe('AaveProviderManager', () => {
  describe('generate', () => {
    it('should generate a new `AaveCustomProvider`', () => {
      const provider = generate({
        selectedNode: RPC_URL,
        backupNodes: BACKUP_RPC_URLS,
        maxTimout: RPC_MAX_TIMEOUT,
      });

      expect(provider).toBeInstanceOf(AaveCustomProvider);
    });
  });
});
