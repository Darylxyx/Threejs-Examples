// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

import '@/assets/css/base.less';
// import '@/assets/js/base.js';

// console.log(window.basefn);

Vue.config.productionTip = false;

window.Vue = Vue;
window.Bridge = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
