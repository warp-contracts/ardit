export interface PstState {
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

export interface PstAction {
  input: PstInput;
  caller: string;
}

export interface PstInput {
  function: PstFunction;
  from: string;
  to: string;
  owner: string;
  spender: string;
  amount: number;
  target: string;
  value: string;
}

export type PstResult = AllowanceResult | BalanceResult | TotalSupplyResult;

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

export type PstFunction =
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

export type ContractResult = { state: PstState } | { result: PstResult };
