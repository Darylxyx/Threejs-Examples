import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        actCardList: [],
        title: '',
        titleType: '',
        connectProgress: '',
    },
    mutations,
    actions,
    getters,
});
window.store = store;
export default store;
