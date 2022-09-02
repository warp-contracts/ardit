import fs from 'fs';
import path from 'path';
import { WarpFactory } from 'warp-contracts';

(async () => {
  // Arweave and Warp initialization
  const warp = WarpFactory.forMainnet();
  const arweave = warp.arweave;

  // Loading contract source and initial state from files
  const contractSrc = fs.readFileSync(path.join(__dirname, '../../dist/contract.js'), 'utf8');
  const jwk = await arweave.wallets.generate();
  const walletAddress = await arweave.wallets.jwkToAddress(jwk);

  const initialState = {
    description: 'Webinar token',
    settings: null,
    symbol: 'Webinar',
    name: 'Webinar',
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
