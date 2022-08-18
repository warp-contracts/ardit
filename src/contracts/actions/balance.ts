import { ContractResult, AtomicAction, AtomicState } from '../types/types';

declare const ContractError;

// return the current balance for the given wallet

export const balanceOf = async (
  state: AtomicState,
  { input: { target } }: AtomicAction
): Promise<ContractResult> => {
  const ticker = state.symbol;

  return { result: { ticker, balance: state.balances[target] || 0, target } };
};

// return the total supply of tokens

export const totalSupply = async (state: AtomicState): Promise<ContractResult> => {
  return { result: { value: state.totalSupply } };
};
