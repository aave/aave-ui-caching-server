import { ethers } from 'ethers';
import { ILendingPool } from '../../contracts/ethers/ILendingPool';
import { ILendingPoolAddressesProviderFactory } from '../../contracts/ethers/ILendingPoolAddressesProviderFactory';
import { ILendingPoolFactory } from '../../contracts/ethers/ILendingPoolFactory';

interface PoolContracts {
  lendingPoolAddressProvider: string;
  lendingPoolContract: ILendingPool;
}

let poolContracts: PoolContracts[] = [];

export const get = (lendingPoolAddressProvider: string) => {
  const index = poolContracts.findIndex(
    (pools) => pools.lendingPoolAddressProvider === lendingPoolAddressProvider
  );
  if (index > -1) {
    return poolContracts[index];
  }

  throw new Error(`Can not find contracts for pool address - ${lendingPoolAddressProvider}`);
};

export const init = async (
  lendingPoolAddressProvider: string,
  ethereumProvider: ethers.providers.JsonRpcProvider
) => {
  const lendingPoolAddressesProviderContract = ILendingPoolAddressesProviderFactory.connect(
    lendingPoolAddressProvider,
    ethereumProvider
  );

  const lendingPoolContract = ILendingPoolFactory.connect(
    await lendingPoolAddressesProviderContract.getLendingPool(),
    ethereumProvider
  );

  add({ lendingPoolAddressProvider, lendingPoolContract });
};

export const add = (context: PoolContracts) => {
  poolContracts = poolContracts.filter(
    (c) => c.lendingPoolAddressProvider !== context.lendingPoolAddressProvider
  );
  poolContracts.push(context);
};
