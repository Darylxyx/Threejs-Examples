<template>
  <div id='app'>
    <router-view/>
  </div>
</template>

<script>
import store from './store';
import TWEEN from 'tween.js';

window.TWEEN = TWEEN;
export default {
    store,
    name: 'App'
}
</script>

<style lang='less' scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>
