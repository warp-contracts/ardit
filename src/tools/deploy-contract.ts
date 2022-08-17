import fs from 'fs';
import path from 'path';
import Arweave from 'arweave';
import { ArWallet, WarpFactory } from 'warp-contracts';
import jwk from '../../.secrets/jwk.json';

(async () => {
  // Loading contract source and initial state from files
  const contractSrc = fs.readFileSync(path.join(__dirname, '../../dist/contract.js'), 'utf8');
  // const initialState = fs.readFileSync(path.join(__dirname, '../contracts/pst/initial-state.json'), 'utf8');
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });
  const walletAddress = await arweave.wallets.jwkToAddress(jwk);

  const initialState = {
    description: 'NFT-based Arweave social app',
    settings: null,
    symbol: 'ARDIT',
    name: 'ArDit',
    decimals: '',
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
  // Arweave and Warp initialization
  const warp = WarpFactory.forMainnet();

  // Deploying contract
  console.log('Deployment started');
  const { contractTxId } = await warp.createContract.deploy({
    wallet: jwk,
    initState: JSON.stringify(initialState),
    src: contractSrc,
    data: { 'Content-Type': 'text/html', body: '<h1>HELLO WORLD</h1>' },
  });
  console.log('Deployment completed: ' + contractTxId);
})();
