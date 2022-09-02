import Arweave from 'arweave';
import { LoggerFactory, WarpFactory, Warp } from 'warp-contracts';

// Set up Warp instance for Arweave mainnet
LoggerFactory.INST.logLevel('debug');
export const warp: Warp = WarpFactory.forMainnet();

// Set up Arweave client
export const arweave: Arweave = warp.arweave;
