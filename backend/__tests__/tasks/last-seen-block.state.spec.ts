import { add, get, remove, update } from '../../src/tasks/last-seen-block.state';

describe('lastSeenBlockState', () => {
  const key = 'KEY';
  const key2 = 'KEY2';

  it('should add key', () => {
    remove(key);
    remove(key2);
    add(key, 1);
    add(key2, 99);
    expect(get(key)).toEqual(1);
    expect(get(key2)).toEqual(99);
  });

  it('should update key', () => {
    remove(key);
    remove(key2);
    add(key, 1);
    add(key2, 99);
    update(key, 2);
    expect(get(key)).toEqual(2);
    expect(get(key2)).toEqual(99);
  });

  it('should upsert key if it doesnt exist', () => {
    remove(key);
    remove(key2);
    add(key2, 99);

    update(key, 2);
    expect(get(key)).toEqual(2);
    expect(get(key2)).toEqual(99);
  });

  it('should remove key', () => {
    remove(key);
    remove(key2);
    add(key, 1);
    add(key2, 99);
    expect(get(key)).toEqual(1);
    remove(key);
    expect(get(key)).toEqual(0);
    expect(get(key2)).toEqual(99);
  });
});
