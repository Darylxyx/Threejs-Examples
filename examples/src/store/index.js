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
        picIndex: 0,
        roundIndex: 0, // 动画播放轮数，每轮展示的装卸货照片不同
    },
    mutations,
    actions,
    getters,
});
window.store = store;
export default store;
