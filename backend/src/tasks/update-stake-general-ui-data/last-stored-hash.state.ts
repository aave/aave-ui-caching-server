// IF `update-stake-general-ui-data` ever needed to run > 1 this needs to turn into an array of state
let lastSeenStoredDataHash = '';

export const set = (hash: string) => {
  lastSeenStoredDataHash = hash;
};

export const get = () => {
  return lastSeenStoredDataHash;
};
