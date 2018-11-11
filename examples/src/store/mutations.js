export default {
    updateUserInfo(state, userInfo) {
        if (state.userInfo) {
            state.userInfo = { ...state.userInfo, ...userInfo };
        } else {
            state.userInfo = { ...userInfo };
        }
    },
    setTitle(state, title) {
        state.title = title;
    },
    setActCardList(state, list) {
        state.actCardList = list;
    },
};
