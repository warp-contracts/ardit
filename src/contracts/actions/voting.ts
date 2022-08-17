import { ContractResult, PstAction, PstState } from '../types/types';

declare const ContractError;

export const upVoteMessage = async (state: PstState, { caller }: PstAction): Promise<ContractResult> => {
  const votes = state.votes;

  if (votes.addresses.includes(caller)) {
    throw new ContractError('Caller has already voted.');
  } else {
    votes.status++;
    votes.addresses.push(caller);
  }
  return { state };
};

export const downVoteMessage = async (state: PstState, { caller }: PstAction): Promise<ContractResult> => {
  const votes = state.votes;

  if (votes.addresses.includes(caller)) {
    throw new ContractError('Caller has already voted.');
  } else {
    votes.status--;
    votes.addresses.push(caller);
  }
  return { state };
};
