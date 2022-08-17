import { ContractResult, PstAction, PstState } from '../types/types';

declare const ContractError;

export const allowance = async (
  state: PstState,
  { caller, input: { owner, spender } }: PstAction
): Promise<ContractResult> => {
  const ticker = state.symbol;

  return { result: { ticker, allowance: _getAllowance(state.allowances, owner, spender), owner, spender } };
};

export const approve = async (
  state: PstState,
  { caller, input: { amount, spender } }: PstAction
): Promise<ContractResult> => {
  _setAllowance(state.allowances || {}, caller, spender, amount);

  return { state };
};

export const _setAllowance = (allowances: any, owner: string, spender: string, amount: number) => {
  if (amount > 0) {
    if (allowances[owner]) {
      allowances[owner][spender] = amount;
    } else {
      allowances[owner] = {
        [spender]: amount,
      };
    }
  } else {
    delete allowances[owner][spender];
    if (!Object.keys(allowances[owner]).length) {
      delete allowances[owner];
    }
  }
};

export const _getAllowance = (allowances: any, owner: string, spender: string) => {
  return allowances[owner] ? allowances[owner][spender] || 0 : 0;
};
