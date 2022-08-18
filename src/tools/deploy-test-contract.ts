import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { AtomicState } from '../contracts/types/types';
import { LoggerFactory, PstContract, Warp, WarpFactory } from 'warp-contracts';
import fs from 'fs';
import path from 'path';
import { AtomicNFTState } from '../../bindings/atomic-nft-js-binding';

interface ArDitState extends AtomicNFTState {
  votes: {
    status: number;
    addresses: [];
  };
}

let contractSrc: string;

let wallet: JWKInterface;
let walletAddress: string;

let initialState: ArDitState;

let arweave: Arweave;
let warp: Warp;

(async () => {
  arweave = Arweave.init({
    host: 'testnet.redstone.tools',
    port: 443,
    protocol: 'https',
  });

  LoggerFactory.INST.logLevel('error');

  warp = WarpFactory.forTestnet();
  wallet = await warp.testing.generateWallet();

  walletAddress = await arweave.wallets.jwkToAddress(wallet);

  contractSrc = fs.readFileSync(path.join(__dirname, '../../dist/contract.js'), 'utf8');

  initialState = {
    description: 'This is the test of Atomic NFT token',
    settings: null,
    symbol: 'atomic-NFT-test',
    name: 'Sample Atomic NFT token',
    decimals: 2,
    totalSupply: 100,
    balances: {
      [walletAddress]: 100,
    },
    allowances: {},
    owner: walletAddress,
    canEvolve: true,
    evolve: '',
    votes: { status: 0, addresses: [] },
  };

  const contractTxId = await warp.createContract.deploy({
    wallet,
    initState: JSON.stringify(initialState),
    src: contractSrc,
    data: { 'Content-Type': 'text/html', body: '<h1>HELLO WORLD</h1>' },
  });

  console.log(contractTxId);
})();
