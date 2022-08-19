import { Contract, WarpFactory } from 'warp-contracts';
import Vue from 'vue';
import Vuex from 'vuex';
import { arweave, warp } from '../environment';
import { deployedContracts } from '../deployed-contracts';
import axios from 'axios';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    arweave,
    warp,
    states: {},
    contract: null,
    walletAddress: null,
    wallet: null,
  },
  mutations: {
    setStates(state, swState) {
      state.states = swState;
    },
    setContract(state, contract) {
      state.contract = contract;
    },
    setWalletAddress(state, walletAddress) {
      state.walletAddress = walletAddress;
    },
    setWallet(state, wallet) {
      state.wallet = wallet;
    },
  },
  actions: {
    async loadState({ commit }) {
      const wallet = await arweave.wallets.generate();
      const walletAddress = await arweave.wallets.jwkToAddress(wallet);
      commit('setWalletAddress', walletAddress);
      commit('setWallet', wallet);
    },
    async loadStates({ commit }) {
      return axios
        .get(
          `https://d2kby8zlc0bxqk.cloudfront.net/all-states?orderBy=contract_creation&order=desc&page=1&groups=xOnWzXwuZ8PYbrjOBpz-kEAV0l0_soyvrxAS35weysU`
        )
        .then(async (res) => {
          const contents = res.data.states;
          const response: any = await Promise.allSettled(
            contents.map(async (r: any) => {
              return await axios.get(`https://gateway.redstone.finance/gateway/contract-data/${r.contract_tx_id}`);
            })
          );
          contents.forEach((c, index) => {
            c.contract_data = response[index].value.data;
            c.state = JSON.parse(c.state);
          });
          commit('setStates', contents);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  modules: {},
});
