import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        actCardList: [],
        title: '',
        titleType: '',
        connectProgress: '',
        picIndex: 0,
        roundIndex: 0, // 动画播放轮数，每轮展示的装卸货照片不同
    },
    mutations: {
        updateUserInfo(state, userInfo) {
            if (state.userInfo) {
                state.userInfo = { ...state.userInfo, ...userInfo };
            } else {
                state.userInfo = { ...userInfo };
            }
        },
        setTitle(state, params) {
            state.title = params.title;
            state.titleType = params.type || 'basic';
            if (params.type === 'connect') { // 接挂阶段
                state.connectProgress = params.progress;
            }
        },
        setActCardList(state, list) {
            state.actCardList = list;
            if (list.indexOf('guide') > -1) {
                document.querySelector('#guideGif').src = `/img/guide.gif?${Math.round(Math.random() * 100)}`;
            }
        },
        showPic(state, index) {
            state.picIndex = index;
        },
        nextRound(state) {
            state.roundIndex++;
            if (state.roundIndex > 4) {
                state.roundIndex = 0;
            }
        },
    },
    actions: {

    }
})
