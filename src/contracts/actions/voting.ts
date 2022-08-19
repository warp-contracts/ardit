import { AtomicAction, AtomicState, ContractResult } from '../types/types';

declare const ContractError;

export const upVoteMessage = async (state: AtomicState, { caller }: AtomicAction): Promise<ContractResult> => {
  const votes = state.votes;

  if (votes.addresses.includes(caller)) {
    throw new ContractError(`Caller has already voted.`);
  }

  votes.status++;
  votes.addresses.push(caller);

  return { state };
};

export const downVoteMessage = async (state: AtomicState, { caller }: AtomicAction): Promise<ContractResult> => {
  const votes = state.votes;

  if (votes.addresses.includes(caller)) {
    throw new ContractError(`Caller has already voted.`);
  }

  votes.status--;
  votes.addresses.push(caller);

  return { state };
};
