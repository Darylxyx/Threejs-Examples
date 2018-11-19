export default {
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
    },
    showPic(state, index) {
        state.picIndex = index;
    },
};
