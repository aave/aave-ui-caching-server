/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface AaveIncentivesControllerInterface extends ethers.utils.Interface {
  functions: {
    "DISTRIBUTION_END()": FunctionFragment;
    "EMISSION_MANAGER()": FunctionFragment;
    "EXTRA_PSM_REWARD()": FunctionFragment;
    "PRECISION()": FunctionFragment;
    "PSM()": FunctionFragment;
    "REVISION()": FunctionFragment;
    "REWARDS_VAULT()": FunctionFragment;
    "REWARD_TOKEN()": FunctionFragment;
    "assets(address)": FunctionFragment;
    "claimRewards(address[],uint256,address,bool)": FunctionFragment;
    "configureAssets(tuple[])": FunctionFragment;
    "getRewardsBalance(address[],address)": FunctionFragment;
    "getUserAssetData(address,address)": FunctionFragment;
    "getUserUnclaimedRewards(address)": FunctionFragment;
    "handleAction(address,uint256,uint256)": FunctionFragment;
    "initialize()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "DISTRIBUTION_END",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "EMISSION_MANAGER",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "EXTRA_PSM_REWARD",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "PRECISION", values?: undefined): string;
  encodeFunctionData(functionFragment: "PSM", values?: undefined): string;
  encodeFunctionData(functionFragment: "REVISION", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "REWARDS_VAULT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "REWARD_TOKEN",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "assets", values: [string]): string;
  encodeFunctionData(
    functionFragment: "claimRewards",
    values: [string[], BigNumberish, string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "configureAssets",
    values: [
      {
        emissionPerSecond: BigNumberish;
        totalStaked: BigNumberish;
        underlyingAsset: string;
      }[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getRewardsBalance",
    values: [string[], string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserAssetData",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserUnclaimedRewards",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "handleAction",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "DISTRIBUTION_END",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "EMISSION_MANAGER",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "EXTRA_PSM_REWARD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "PRECISION", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "PSM", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "REVISION", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "REWARDS_VAULT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "REWARD_TOKEN",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "assets", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "configureAssets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRewardsBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserAssetData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserUnclaimedRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "handleAction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;

  events: {
    "AssetConfigUpdated(address,uint256)": EventFragment;
    "AssetIndexUpdated(address,uint256)": EventFragment;
    "RewardsAccrued(address,uint256)": EventFragment;
    "RewardsClaimed(address,address,uint256)": EventFragment;
    "UserIndexUpdated(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AssetConfigUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AssetIndexUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardsAccrued"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardsClaimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UserIndexUpdated"): EventFragment;
}

export class AaveIncentivesController extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: AaveIncentivesControllerInterface;

  functions: {
    DISTRIBUTION_END(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "DISTRIBUTION_END()"(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    EMISSION_MANAGER(
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "EMISSION_MANAGER()"(
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    EXTRA_PSM_REWARD(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "EXTRA_PSM_REWARD()"(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    PRECISION(
      overrides?: CallOverrides
    ): Promise<{
      0: number;
    }>;

    "PRECISION()"(
      overrides?: CallOverrides
    ): Promise<{
      0: number;
    }>;

    PSM(
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "PSM()"(
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    REVISION(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "REVISION()"(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    REWARDS_VAULT(
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "REWARDS_VAULT()"(
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    REWARD_TOKEN(
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "REWARD_TOKEN()"(
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    assets(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<{
      emissionPerSecond: BigNumber;
      lastUpdateTimestamp: BigNumber;
      index: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    "assets(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<{
      emissionPerSecond: BigNumber;
      lastUpdateTimestamp: BigNumber;
      index: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    claimRewards(
      assets: string[],
      amount: BigNumberish,
      to: string,
      stake: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "claimRewards(address[],uint256,address,bool)"(
      assets: string[],
      amount: BigNumberish,
      to: string,
      stake: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    configureAssets(
      assetsConfigInput: {
        emissionPerSecond: BigNumberish;
        totalStaked: BigNumberish;
        underlyingAsset: string;
      }[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "configureAssets(tuple[])"(
      assetsConfigInput: {
        emissionPerSecond: BigNumberish;
        totalStaked: BigNumberish;
        underlyingAsset: string;
      }[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    getRewardsBalance(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "getRewardsBalance(address[],address)"(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    getUserAssetData(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "getUserAssetData(address,address)"(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    getUserUnclaimedRewards(
      _user: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "getUserUnclaimedRewards(address)"(
      _user: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    handleAction(
      user: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "handleAction(address,uint256,uint256)"(
      user: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    initialize(overrides?: Overrides): Promise<ContractTransaction>;

    "initialize()"(overrides?: Overrides): Promise<ContractTransaction>;
  };

  DISTRIBUTION_END(overrides?: CallOverrides): Promise<BigNumber>;

  "DISTRIBUTION_END()"(overrides?: CallOverrides): Promise<BigNumber>;

  EMISSION_MANAGER(overrides?: CallOverrides): Promise<string>;

  "EMISSION_MANAGER()"(overrides?: CallOverrides): Promise<string>;

  EXTRA_PSM_REWARD(overrides?: CallOverrides): Promise<BigNumber>;

  "EXTRA_PSM_REWARD()"(overrides?: CallOverrides): Promise<BigNumber>;

  PRECISION(overrides?: CallOverrides): Promise<number>;

  "PRECISION()"(overrides?: CallOverrides): Promise<number>;

  PSM(overrides?: CallOverrides): Promise<string>;

  "PSM()"(overrides?: CallOverrides): Promise<string>;

  REVISION(overrides?: CallOverrides): Promise<BigNumber>;

  "REVISION()"(overrides?: CallOverrides): Promise<BigNumber>;

  REWARDS_VAULT(overrides?: CallOverrides): Promise<string>;

  "REWARDS_VAULT()"(overrides?: CallOverrides): Promise<string>;

  REWARD_TOKEN(overrides?: CallOverrides): Promise<string>;

  "REWARD_TOKEN()"(overrides?: CallOverrides): Promise<string>;

  assets(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<{
    emissionPerSecond: BigNumber;
    lastUpdateTimestamp: BigNumber;
    index: BigNumber;
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
  }>;

  "assets(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<{
    emissionPerSecond: BigNumber;
    lastUpdateTimestamp: BigNumber;
    index: BigNumber;
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
  }>;

  claimRewards(
    assets: string[],
    amount: BigNumberish,
    to: string,
    stake: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "claimRewards(address[],uint256,address,bool)"(
    assets: string[],
    amount: BigNumberish,
    to: string,
    stake: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  configureAssets(
    assetsConfigInput: {
      emissionPerSecond: BigNumberish;
      totalStaked: BigNumberish;
      underlyingAsset: string;
    }[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "configureAssets(tuple[])"(
    assetsConfigInput: {
      emissionPerSecond: BigNumberish;
      totalStaked: BigNumberish;
      underlyingAsset: string;
    }[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  getRewardsBalance(
    assets: string[],
    user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getRewardsBalance(address[],address)"(
    assets: string[],
    user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUserAssetData(
    user: string,
    asset: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getUserAssetData(address,address)"(
    user: string,
    asset: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUserUnclaimedRewards(
    _user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getUserUnclaimedRewards(address)"(
    _user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  handleAction(
    user: string,
    userBalance: BigNumberish,
    totalSupply: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "handleAction(address,uint256,uint256)"(
    user: string,
    userBalance: BigNumberish,
    totalSupply: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  initialize(overrides?: Overrides): Promise<ContractTransaction>;

  "initialize()"(overrides?: Overrides): Promise<ContractTransaction>;

  callStatic: {
    DISTRIBUTION_END(overrides?: CallOverrides): Promise<BigNumber>;

    "DISTRIBUTION_END()"(overrides?: CallOverrides): Promise<BigNumber>;

    EMISSION_MANAGER(overrides?: CallOverrides): Promise<string>;

    "EMISSION_MANAGER()"(overrides?: CallOverrides): Promise<string>;

    EXTRA_PSM_REWARD(overrides?: CallOverrides): Promise<BigNumber>;

    "EXTRA_PSM_REWARD()"(overrides?: CallOverrides): Promise<BigNumber>;

    PRECISION(overrides?: CallOverrides): Promise<number>;

    "PRECISION()"(overrides?: CallOverrides): Promise<number>;

    PSM(overrides?: CallOverrides): Promise<string>;

    "PSM()"(overrides?: CallOverrides): Promise<string>;

    REVISION(overrides?: CallOverrides): Promise<BigNumber>;

    "REVISION()"(overrides?: CallOverrides): Promise<BigNumber>;

    REWARDS_VAULT(overrides?: CallOverrides): Promise<string>;

    "REWARDS_VAULT()"(overrides?: CallOverrides): Promise<string>;

    REWARD_TOKEN(overrides?: CallOverrides): Promise<string>;

    "REWARD_TOKEN()"(overrides?: CallOverrides): Promise<string>;

    assets(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<{
      emissionPerSecond: BigNumber;
      lastUpdateTimestamp: BigNumber;
      index: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    "assets(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<{
      emissionPerSecond: BigNumber;
      lastUpdateTimestamp: BigNumber;
      index: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    claimRewards(
      assets: string[],
      amount: BigNumberish,
      to: string,
      stake: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "claimRewards(address[],uint256,address,bool)"(
      assets: string[],
      amount: BigNumberish,
      to: string,
      stake: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    configureAssets(
      assetsConfigInput: {
        emissionPerSecond: BigNumberish;
        totalStaked: BigNumberish;
        underlyingAsset: string;
      }[],
      overrides?: CallOverrides
    ): Promise<void>;

    "configureAssets(tuple[])"(
      assetsConfigInput: {
        emissionPerSecond: BigNumberish;
        totalStaked: BigNumberish;
        underlyingAsset: string;
      }[],
      overrides?: CallOverrides
    ): Promise<void>;

    getRewardsBalance(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getRewardsBalance(address[],address)"(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserAssetData(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserAssetData(address,address)"(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserUnclaimedRewards(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserUnclaimedRewards(address)"(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    handleAction(
      user: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "handleAction(address,uint256,uint256)"(
      user: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    initialize(overrides?: CallOverrides): Promise<void>;

    "initialize()"(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    AssetConfigUpdated(asset: string | null, emission: null): EventFilter;

    AssetIndexUpdated(asset: string | null, index: null): EventFilter;

    RewardsAccrued(user: string | null, amount: null): EventFilter;

    RewardsClaimed(
      user: string | null,
      to: string | null,
      amount: null
    ): EventFilter;

    UserIndexUpdated(
      user: string | null,
      asset: string | null,
      index: null
    ): EventFilter;
  };

  estimateGas: {
    DISTRIBUTION_END(overrides?: CallOverrides): Promise<BigNumber>;

    "DISTRIBUTION_END()"(overrides?: CallOverrides): Promise<BigNumber>;

    EMISSION_MANAGER(overrides?: CallOverrides): Promise<BigNumber>;

    "EMISSION_MANAGER()"(overrides?: CallOverrides): Promise<BigNumber>;

    EXTRA_PSM_REWARD(overrides?: CallOverrides): Promise<BigNumber>;

    "EXTRA_PSM_REWARD()"(overrides?: CallOverrides): Promise<BigNumber>;

    PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    "PRECISION()"(overrides?: CallOverrides): Promise<BigNumber>;

    PSM(overrides?: CallOverrides): Promise<BigNumber>;

    "PSM()"(overrides?: CallOverrides): Promise<BigNumber>;

    REVISION(overrides?: CallOverrides): Promise<BigNumber>;

    "REVISION()"(overrides?: CallOverrides): Promise<BigNumber>;

    REWARDS_VAULT(overrides?: CallOverrides): Promise<BigNumber>;

    "REWARDS_VAULT()"(overrides?: CallOverrides): Promise<BigNumber>;

    REWARD_TOKEN(overrides?: CallOverrides): Promise<BigNumber>;

    "REWARD_TOKEN()"(overrides?: CallOverrides): Promise<BigNumber>;

    assets(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "assets(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimRewards(
      assets: string[],
      amount: BigNumberish,
      to: string,
      stake: boolean,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "claimRewards(address[],uint256,address,bool)"(
      assets: string[],
      amount: BigNumberish,
      to: string,
      stake: boolean,
      overrides?: Overrides
    ): Promise<BigNumber>;

    configureAssets(
      assetsConfigInput: {
        emissionPerSecond: BigNumberish;
        totalStaked: BigNumberish;
        underlyingAsset: string;
      }[],
      overrides?: Overrides
    ): Promise<BigNumber>;

    "configureAssets(tuple[])"(
      assetsConfigInput: {
        emissionPerSecond: BigNumberish;
        totalStaked: BigNumberish;
        underlyingAsset: string;
      }[],
      overrides?: Overrides
    ): Promise<BigNumber>;

    getRewardsBalance(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getRewardsBalance(address[],address)"(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserAssetData(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserAssetData(address,address)"(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserUnclaimedRewards(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserUnclaimedRewards(address)"(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    handleAction(
      user: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "handleAction(address,uint256,uint256)"(
      user: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    initialize(overrides?: Overrides): Promise<BigNumber>;

    "initialize()"(overrides?: Overrides): Promise<BigNumber>;
  };

  populateTransaction: {
    DISTRIBUTION_END(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "DISTRIBUTION_END()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    EMISSION_MANAGER(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "EMISSION_MANAGER()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    EXTRA_PSM_REWARD(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "EXTRA_PSM_REWARD()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    PRECISION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "PRECISION()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    PSM(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "PSM()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    REVISION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "REVISION()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    REWARDS_VAULT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "REWARDS_VAULT()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    REWARD_TOKEN(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "REWARD_TOKEN()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    assets(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "assets(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claimRewards(
      assets: string[],
      amount: BigNumberish,
      to: string,
      stake: boolean,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "claimRewards(address[],uint256,address,bool)"(
      assets: string[],
      amount: BigNumberish,
      to: string,
      stake: boolean,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    configureAssets(
      assetsConfigInput: {
        emissionPerSecond: BigNumberish;
        totalStaked: BigNumberish;
        underlyingAsset: string;
      }[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "configureAssets(tuple[])"(
      assetsConfigInput: {
        emissionPerSecond: BigNumberish;
        totalStaked: BigNumberish;
        underlyingAsset: string;
      }[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    getRewardsBalance(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getRewardsBalance(address[],address)"(
      assets: string[],
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserAssetData(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getUserAssetData(address,address)"(
      user: string,
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserUnclaimedRewards(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getUserUnclaimedRewards(address)"(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    handleAction(
      user: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "handleAction(address,uint256,uint256)"(
      user: string,
      userBalance: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    initialize(overrides?: Overrides): Promise<PopulatedTransaction>;

    "initialize()"(overrides?: Overrides): Promise<PopulatedTransaction>;
  };
}
