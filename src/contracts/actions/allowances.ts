import { ContractResult, AtomicAction, AtomicState } from '../types/types';

declare const ContractError;

// return the amount which spender is allowed to withdraw from owner

export const allowance = async (
  state: AtomicState,
  { input: { owner, spender } }: AtomicAction
): Promise<ContractResult> => {
  const ticker = state.symbol;

  return { result: { ticker, allowance: _getAllowance(state.allowances, owner, spender), owner, spender } };
};

// approve tokens to be spent by another account between wallets

export const approve = async (
  state: AtomicState,
  { caller, input: { amount, spender } }: AtomicAction
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
