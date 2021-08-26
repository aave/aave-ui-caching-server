import { ethers } from 'ethers';
import { PROTOCOLS_WITH_INCENTIVES_ADDRESSES } from '../../config';
import { AaveIncentivesController } from '../../contracts/ethers/AaveIncentivesController';
import { AaveIncentivesController__factory } from '../../contracts/ethers/AaveIncentivesController__factory';
import { ILendingPool } from '../../contracts/ethers/ILendingPool';
import { ILendingPoolAddressesProviderFactory } from '../../contracts/ethers/ILendingPoolAddressesProviderFactory';
import { ILendingPoolFactory } from '../../contracts/ethers/ILendingPoolFactory';
import { getIncentivesControllerAddressRpc } from '../../services/pool-data';

interface PoolContracts {
  poolAddress: string;
  incentivesController: AaveIncentivesController;
  lendingPoolContract: ILendingPool;
}

let poolContracts: PoolContracts[] = [];

export const get = (poolAddress: string) => {
  const index = poolContracts.findIndex((pools) => pools.poolAddress === poolAddress);
  if (index > -1) {
    return poolContracts[index];
  }

  throw new Error(`Can not find contracts for pool address - ${poolAddress}`);
};

export const init = async (
  poolAddress: string,
  ethereumProvider: ethers.providers.JsonRpcProvider
) => {
  const lendingPoolAddressesProviderContract = ILendingPoolAddressesProviderFactory.connect(
    poolAddress,
    ethereumProvider
  );

  const lendingPoolContract = ILendingPoolFactory.connect(
    await lendingPoolAddressesProviderContract.getLendingPool(),
    ethereumProvider
  );

  const incentivesController = AaveIncentivesController__factory.connect(
    PROTOCOLS_WITH_INCENTIVES_ADDRESSES.includes(poolAddress)
      ? await getIncentivesControllerAddressRpc()
      : ethers.constants.AddressZero,
    ethereumProvider
  );

  add({ poolAddress, lendingPoolContract, incentivesController });
};

export const add = (context: PoolContracts) => {
  poolContracts = poolContracts.filter((c) => c.poolAddress !== context.poolAddress);
  poolContracts.push(context);
};
