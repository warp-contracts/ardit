<template>
  <div class="home">
    <Header />
    <Contents :loading="loading" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from '@/components/Header/Header.vue';
import Contents from '@/components/Contents/Contents.vue';

import { mapActions, mapState } from 'vuex';
import axios from 'axios';

export default Vue.extend({
  name: 'Contract',
  components: {
    Header,
    Contents,
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async updateContents() {
      this.loading = true;
      setTimeout(async () => {
        console.log(this);
        await this.update();
        this.loading = false;
      }, 6000);
    },
    async update() {
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
          this.$store.commit('setStates', contents);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    ...mapState(['state', 'validity', 'contract', 'arweave', 'warp', 'walletAddress']),
    ...mapActions(['loadStates']),
  },
});
</script>

<style lang="scss">
.home {
  width: 70%;
  margin: 0 auto;

  @media only screen and (max-width: 1024px) {
    width: 90%;
  }

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
}
</style>
