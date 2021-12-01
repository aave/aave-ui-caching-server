import { ethers } from 'ethers';
import { ILendingPool } from '../../contracts/ethers/ILendingPool';
import { ILendingPoolAddressesProviderFactory } from '../../contracts/ethers/ILendingPoolAddressesProviderFactory';
import { ILendingPoolFactory } from '../../contracts/ethers/ILendingPoolFactory';
import { ReserveIncentivesData } from '../../graphql/object-types/incentives';
import { getPoolIncentivesRPC } from '../../services/incentives-data';

interface PoolContracts {
  lendingPoolAddressProvider: string;
  incentiveControllers: string[];
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

  // get all incentive providers:
  const reserveIncentives: ReserveIncentivesData[] = await getPoolIncentivesRPC({
    lendingPoolAddressProvider,
  });
  const incentiveControllers: string[] = [];
  reserveIncentives.forEach((incentive: ReserveIncentivesData) => {
    const aIncentiveController = incentive.aIncentiveData.incentiveControllerAddress.toLowerCase();
    const sIncentiveController = incentive.sIncentiveData.incentiveControllerAddress.toLowerCase();
    const vIncentiveController = incentive.vIncentiveData.incentiveControllerAddress.toLowerCase();
    if (incentiveControllers.indexOf(aIncentiveController) === -1) {
      incentiveControllers.push(aIncentiveController);
    }
    if (incentiveControllers.indexOf(sIncentiveController) === -1) {
      incentiveControllers.push(sIncentiveController);
    }
    if (incentiveControllers.indexOf(vIncentiveController) === -1) {
      incentiveControllers.push(vIncentiveController);
    }
  });

  if (incentiveControllers.length === 0) {
    incentiveControllers.push(ethers.constants.AddressZero);
  }

  add({ lendingPoolAddressProvider, lendingPoolContract, incentiveControllers });
};

export const add = (context: PoolContracts) => {
  poolContracts = poolContracts.filter(
    (c) => c.lendingPoolAddressProvider !== context.lendingPoolAddressProvider
  );
  poolContracts.push(context);
};
