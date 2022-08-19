/* initialize Warp */
const warp = WarpFactory.forMainnet();

/* deploy contract from source */
const { contractTxId } = await warp.createContract.deployFromSourceTx({
  wallet: jwk,
  initState: JSON.stringify(initialState),
  src: 'xOnWzXwuZ8PYbrjOBpz-kEAV0l0_soyvrxAS35weysU',
  data: { 'Content-Type': 'text/html', body: '<h1>HELLO WORLD</h1>' },
});

console.log('Deployment completed: ' + contractTxId);

/* connect Warp to contract */
const contract = warp.contract(contractTxId).connect(jwk);

/* write interaction */
const tx = await contract.writeInteraction({
  function: 'upVoteMessage',
});

/* read contract's state */
const { cachedValue } = await contract.readState();

console.log(`Contract state: ${cachedValue.state}`);
