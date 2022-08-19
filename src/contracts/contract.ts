import { balanceOf, totalSupply } from './actions/balance';
import { allowance, approve } from './actions/allowances';
import { evolve } from './actions/evolve';
import { transfer, transferFrom } from './actions/transfers';
import { ContractResult, AtomicAction, AtomicResult, AtomicState } from './types/types';
import { downVoteMessage, upVoteMessage } from './actions/voting';

declare const ContractError;

export async function handle(state: AtomicState, action: AtomicAction): Promise<ContractResult> {
  const input = action.input;

  switch (input.function) {
    case 'balanceOf':
      return await balanceOf(state, action);
    case 'totalSupply':
      return await totalSupply(state);
    case 'allowance':
      return await allowance(state, action);
    case 'approve':
      return await approve(state, action);
    case 'evolve':
      return await evolve(state, action);
    case 'transfer':
      return await transfer(state, action);
    case 'transferFrom':
      return await transferFrom(state, action);
    case 'upVoteMessage':
      return await upVoteMessage(state, action);
    case 'downVoteMessage':
      return await downVoteMessage(state, action);
      default:
      throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
  }
}
