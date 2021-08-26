import { get, set } from '../../../src/tasks/update-stake-general-ui-data/last-stored-hash.state';

describe('lastSeenStoredDataHash', () => {
  it('should be default empty string', () => {
    expect(get()).toEqual('');
  });

  it('should set and get correctly', () => {
    expect(get()).toEqual('');
    set('123');
    expect(get()).toEqual('123');
  });
});
