import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

import '@/assets/css/base.less';

Vue.config.productionTip = false;
window.THREE = THREE;
window.TWEEN = TWEEN;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');