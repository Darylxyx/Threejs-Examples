export default {
    async getUserInfo(ctx) {
        if (ctx.state.userInfo) {
            return ctx.state.userInfo;
        }
        const res = await window.$http.post('/v1/tos/index/vegaSend', {
            t: 'json',
            m: 'index',
            f: 'userInfo',
        });
        ctx.commit('updateUserInfo', res);
        return res;
    },
};
