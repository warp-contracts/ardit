import { LoggerFactory } from 'warp-contracts';
import { ContractResult, AtomicAction, AtomicState } from '../types/types';
import { _getAllowance, _setAllowance } from './allowances';

declare const ContractError;

// allows to transfer tokens between wallets

export const transfer = async (
  state: AtomicState,
  { caller, input: { to, amount } }: AtomicAction
): Promise<ContractResult> => {
  return _transfer(state, caller, to, amount);
};

// allows transferring tokens using the allowance mechanism

export const transferFrom = async (
  state: AtomicState,
  { caller, input: { from, to, amount } }: AtomicAction
): Promise<ContractResult> => {
  const allowance = _getAllowance(state.allowances, from, caller);

  if (allowance < amount) {
    throw new ContractError(`Caller allowance not high enough to send ${amount} token(s)!`);
  }

  _setAllowance(state.allowances, from, caller, allowance - amount);

  return _transfer(state, from, to, amount);
};

const _transfer = async (state: AtomicState, from: string, to: string, amount: number): Promise<ContractResult> => {
  const balances = state.balances;
  if (!balances[from]) {
    throw new ContractError(`Caller balance is not defined!`);
  }

  if (balances[from] < amount) {
    throw new ContractError(`Caller balance not high enough to send ${amount} token(s)! ${balances[from]} ${from}`);
  }

  const fromBalance = balances[from];

  if (fromBalance - amount == 0) {
    delete balances[from];
  } else {
    balances[from] -= amount;
  }

  if (to in balances) {
    balances[to] += amount;
  } else {
    balances[to] = amount;
  }

  _claimOwnership(state, from, to);

  return { state };
};

const _claimOwnership = (state: AtomicState, from: string, to: string) => {
  const fromBalance = state.balances[from];
  const toBalance = state.balances[to];

  if (state.owner && fromBalance != state.totalSupply) {
    state.owner = null;
  }

  if (toBalance == state.totalSupply) {
    state.owner = to;
  }
};
