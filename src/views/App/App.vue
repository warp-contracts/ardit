<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'App',
  beforeMount() {
    this.loadState();
    this.loadStates();
  },
  methods: {
    ...mapActions(['loadState', 'loadStates']),
  },
};
</script>

<style lang="scss" src="./App.scss" />
