import { ContractResult, PstAction, PstState } from '../types/types';

declare const ContractError;

export const balanceOf = async (state: PstState, { caller, input: { target } }: PstAction): Promise<ContractResult> => {
  const ticker = state.symbol;

  return { result: { ticker, balance: state.balances[target] || 0, target } };
};

export const totalSupply = async (state: PstState): Promise<ContractResult> => {
  return { result: { value: state.totalSupply } };
};
