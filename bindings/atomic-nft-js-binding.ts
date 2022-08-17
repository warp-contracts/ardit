import fs from 'fs';
import path from 'path';

import {
  ArWallet,
  Contract,
  ContractDeploy,
  HandlerBasedContract,
  Warp,
  WriteInteractionResponse,
} from 'warp-contracts';

/**
 * The result from the "balanceOf" view method on the Atomic NFT Contract.
 */
export interface BalanceResult {
  balance: number;
  ticker: string;
  target: string;
}

/**
 * The result from the "totalSupply" view method on the Atomic NFT Contract.
 */
export interface TotalSupplyResult {
  value: number;
}

/**
 * The result from the "allowance" view method on the Atomic NFT Contract.
 */
export interface AllowanceResult {
  ticker: string;
  owner: string;
  spender: string;
  allowance: number;
}

/**
 * Interface for all contracts the implement the {@link Evolve} feature.
 * Evolve is a feature that allows to change contract's source
 * code, without having to deploy a new contract.
 * See ({@link Evolve})
 */
export interface EvolvingContract {
  /**
   * allows to post new contract source on Arweave
   * @param newContractSource - new contract source...
   */
  saveNewSource(newContractSource: string): Promise<string | null>;
  /**
   * effectively evolves the contract to the source.
   * This requires the {@link saveNewSource} to be called first
   * and its transaction to be confirmed by the network.
   * @param newSrcTxId - result of the {@link saveNewSource} method call.
   */
  evolve(newSrcTxId: string): Promise<string | null>;
}
/**
 * Interface describing state for all Evolve-compatible contracts.
 */
export interface EvolveState {
  settings: any[] | unknown | null;
  /**
   * whether contract is allowed to evolve. seems to default to true..
   */
  canEvolve: boolean;
  /**
   * the transaction id of the Arweave transaction with the updated source code.
   */
  evolve: string;
  /**
   * the owner of this contract who can initiate evolution
   */
  owner: string;
}

/**
 * Interface describing base state for all ERC20 contracts.
 */
export interface ERC20State extends EvolveState {
  owner: string;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: number;
  balances: {
    [key: string]: number;
  };
  allowances: {
    [owner: string]: {
      [spender: string]: number;
    };
  };
}

/**
 * Interface describing base state for Atomic NFT contracts.
 */
export interface AtomicNFTState extends ERC20State {
  [x: string]: any;
  description?: string;
}

/**
 * Interface describing data required for making a transfer
 */
export interface TransferInput {
  to: string;
  amount: number;
}

/**
 * Interface describing data required for making a transfer with allowance
 */
export interface TransferFromInput {
  from: string;
  to: string;
  amount: number;
}

/**
 * Interface describing data required for making a transfer
 */
export interface ApproveInput {
  spender: string;
  amount: number;
}

/**
 * A type of {@link Contract} designed specifically for the interaction with
 * ERC20 contract.
 */
export interface ERC20Contract extends Contract<ERC20State> {
  /**
   * return the current balance for the given wallet
   * @param target - wallet address
   */
  balanceOf(target: string): Promise<BalanceResult>;

  /**
   * return the total supply of tokens
   */
  totalSupply(): Promise<TotalSupplyResult>;

  /**
   * return the amount which spender is allowed to withdraw from owner.
   * @param owner - wallet address from which spender can withdraw the tokens
   * @param spender - wallet address allowed to withdraw tokens from owner
   */
  allowance(owner: string, spender: string): Promise<AllowanceResult>;

  /**
   * returns the current contract state
   */
  currentState(): Promise<AtomicNFTState>;
  /**
   * allows to transfer tokens between wallets
   * @param transfer - data required to perform a transfer, see {@link transfer}
   */
  transfer(transfer: TransferInput): Promise<WriteInteractionResponse | null>;

  /**
   * allows transferring tokens using the allowance mechanism
   * @param transfer - data required to perform a transfer, see {@link transfer}
   */
  transferFrom(transfer: TransferFromInput): Promise<WriteInteractionResponse | null>;

  /**
   * approve tokens to be spent by another account between wallets
   * @param transfer - data required to perform a transfer, see {@link transfer}
   */
  approve(transfer: ApproveInput): Promise<WriteInteractionResponse | null>;
}

/**
 * A type of {@link Contract} designed specifically for the interaction with
 * Atomic NFT contract.
 */
export interface AtomicNFTContract extends ERC20Contract {}

export class ERC20ContractImpl extends HandlerBasedContract<ERC20State> implements ERC20Contract {
  async balanceOf(target: string): Promise<BalanceResult> {
    const interactionResult = await this.viewState({ function: 'balanceOf', target });

    if (interactionResult.type !== 'ok') {
      throw Error(interactionResult.errorMessage);
    }

    return interactionResult.result as BalanceResult;
  }

  async totalSupply(): Promise<TotalSupplyResult> {
    const interactionResult = await this.viewState({ function: 'totalSupply' });

    if (interactionResult.type !== 'ok') {
      throw Error(interactionResult.errorMessage);
    }

    return interactionResult.result as TotalSupplyResult;
  }

  async allowance(owner: string, spender: string): Promise<AllowanceResult> {
    const interactionResult = await this.viewState({ function: 'allowance', owner, spender });

    if (interactionResult.type !== 'ok') {
      throw Error(interactionResult.errorMessage);
    }

    return interactionResult.result as AllowanceResult;
  }

  async currentState() {
    return (await super.readState()).cachedValue.state;
  }

  async evolve(newSrcTxId: string): Promise<WriteInteractionResponse | null> {
    return Promise.resolve(undefined);
  }

  saveNewSource(newContractSource: string): Promise<string | null> {
    return Promise.resolve(undefined);
  }

  async transfer(transfer: TransferInput): Promise<WriteInteractionResponse | null> {
    return await this.writeInteraction({ function: 'transfer', ...transfer }, { strict: true });
  }

  async transferFrom(transfer: TransferFromInput): Promise<WriteInteractionResponse | null> {
    return await this.writeInteraction({ function: 'transferFrom', ...transfer }, { strict: true });
  }

  async approve(approve: ApproveInput): Promise<WriteInteractionResponse | null> {
    return await this.writeInteraction({ function: 'approve', ...approve }, { strict: true });
  }
}

export class AtomicNFTContractImpl extends ERC20ContractImpl implements ERC20Contract {}

export async function deployAtomicNFT(
  Warp: Warp,
  initialState: AtomicNFTState,
  ownerWallet: ArWallet
): Promise<[AtomicNFTState, ContractDeploy]> {
  // deploying contract using the new SDK.
  return Warp.createContract
    .deploy({
      wallet: ownerWallet,
      initState: JSON.stringify(initialState),
      src: fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8'),
      data: { 'Content-Type': 'text/html', body: '<h1>HELLO WORLD</h1>' },
    })
    .then((txId) => [initialState, txId]);
}

export async function connectAtomicNFT(Warp: Warp, contractTxId: string, wallet: ArWallet): Promise<AtomicNFTContract> {
  let contract = new AtomicNFTContractImpl(contractTxId, Warp).setEvaluationOptions({
    internalWrites: true,
  }) as AtomicNFTContract;

  return contract.connect(wallet) as AtomicNFTContract;
}
