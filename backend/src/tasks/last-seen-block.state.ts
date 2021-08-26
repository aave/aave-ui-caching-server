let lastSeenBlockNumbers: { key: string; blockNumber: number }[] = [];

export const add = (key: string, blockNumber: number) => {
  lastSeenBlockNumbers = lastSeenBlockNumbers.filter((c) => c.key !== key);
  lastSeenBlockNumbers.push({ key, blockNumber });
};

export const update = (key: string, blockNumber: number) => {
  const index = lastSeenBlockNumbers.findIndex((lastSeen) => lastSeen.key === key);
  if (index > -1) {
    lastSeenBlockNumbers[index].blockNumber = blockNumber;
  } else {
    add(key, blockNumber);
  }
};

export const get = (key: string) => {
  const index = lastSeenBlockNumbers.findIndex((block) => block.key === key);
  if (index > -1) {
    return lastSeenBlockNumbers[index].blockNumber;
  }
  return 0;
};

export const remove = (key: string) => {
  lastSeenBlockNumbers = lastSeenBlockNumbers.filter((c) => c.key !== key);
};
