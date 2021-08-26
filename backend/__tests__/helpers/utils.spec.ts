import { createHash, jsonParse, sleep } from '../../src/helpers/utils';

describe('utils', () => {
  describe('sleep', () => {
    it('should sleep for 1000 seconds', async () => {
      const timestamp = new Date().getTime();
      await sleep(1000);
      const timestamp2 = new Date().getTime();
      expect(timestamp2 - timestamp).toBeGreaterThan(999);

      // process of new date may add some time!
      expect(timestamp2 - timestamp).toBeLessThan(1100);
    });
  });

  describe('jsonParse', () => {
    it('should parse json', () => {
      const parsed = jsonParse<{ foo: boolean }>(JSON.stringify({ foo: true }));
      expect(parsed).toEqual({ foo: true });
    });
  });

  describe('createHash', () => {
    it('should hash correctly', () => {
      const parsed = createHash({ foo: true, boo: false });
      expect(parsed).toEqual('ZcydfSyD+S/1ljPdDYKFXA==');
    });
  });
});
