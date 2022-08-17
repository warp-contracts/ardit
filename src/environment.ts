import Arweave from 'arweave';
import { LoggerFactory, WarpFactory, Warp } from 'warp-contracts';

// Set up Arweave client
export const arweave: Arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

LoggerFactory.INST.logLevel('debug');

// const warp = new WarpWebFactory.memCached(arweave);
export const warp: Warp = WarpFactory.forMainnet();
