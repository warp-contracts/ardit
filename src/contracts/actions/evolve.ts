import { ContractResult, PstAction, PstState } from '../types/types';

declare const ContractError;

export const evolve = async (state: PstState, { caller, input: { value } }: PstAction): Promise<ContractResult> => {
  const evolve = value;
  const owner = state.owner;

  if (caller != owner) {
    throw new ContractError('Evolve permissions error - only contract owner can evolve');
  }

  if (!state.canEvolve) {
    throw new ContractError('Evolve not allowed');
  }

  state.evolve = evolve;

  return { state };
};
