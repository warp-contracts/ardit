export interface AtomicState {
  totalSupply: number;
  symbol: string;
  name: string;
  owner: string;
  balances: {
    [address: string]: number;
  };
  allowances: {
    [address: string]: {
      [address: string]: number;
    };
  };
  canEvolve: boolean;
  evolve: string;
  votes: {
    addresses: string[];
    status: number;
  };
}

export interface AtomicAction {
  input: AtomicInput;
  caller: string;
}

export interface AtomicInput {
  function: AtomicFunction;
  from: string;
  to: string;
  owner: string;
  spender: string;
  amount: number;
  target: string;
  value: string;
}

export type AtomicResult = AllowanceResult | BalanceResult | TotalSupplyResult;

export interface AllowanceResult {
  ticker: string;
  owner: string;
  spender: string;
  allowance: number;
}

export interface BalanceResult {
  target: string;
  ticker: string;
  balance: number;
}

export interface TotalSupplyResult {
  value: number;
}

export type AtomicFunction =
  | 'transfer'
  | 'transferFrom'
  | 'balanceOf'
  | 'allowance'
  | 'approve'
  | 'totalSupply'
  | 'evolve'
  | 'postMessage'
  | 'upVoteMessage'
  | 'downVoteMessage';

export type ContractResult = { state: AtomicState } | { result: AtomicResult };
