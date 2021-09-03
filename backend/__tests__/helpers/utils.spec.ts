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

// xit('helper test to use when debugging', async () => {
//   // expect(utils.id('RewardsClaimed(address,address,uint256)')).toEqual(0);
//   //expect(utils.id('RewardsClaimed(address,address,address,uint256)')).toEqual(0);

//   // const result = await getUsersFromLogs(
//   //   ['0x357D51124f59836DeD84c8a1730D72B749d8BC23'],
//   //   18695605,
//   //   18695606,
//   //   ['RewardsClaimed(address,address,address,uint256)']
//   // );

//   const alchemyWeb3Provider = createAlchemyWeb3(
//     'xxxxx'
//   );

//   const topics = ['RewardsClaimed(address,address,address,uint256)'];

//   const rawLogs = await alchemyWeb3Provider.eth.getPastLogs({
//     fromBlock: 18696158,
//     toBlock: 18696158,
//     topics: topics.map((t) => utils.id(t)),
//     address: ['0x357D51124f59836DeD84c8a1730D72B749d8BC23'],
//   });
//   const users: string[] = [];
//   rawLogs.forEach((data) => {
//     const logs = alchemyWeb3Provider.eth.abi.decodeLog(
//       [
//         {
//           type: 'address',
//           name: 'from',
//           indexed: true,
//         },
//         {
//           type: 'address',
//           name: 'to',
//           indexed: true,
//         },
//       ],
//       '',
//       [data.topics[1], data.topics[2]]
//     );

//     users.push(logs.from);
//   });

//   expect(users).toEqual(true);
// });
