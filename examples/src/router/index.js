import Vue from 'vue';
import Router from 'vue-router';
import G7Logo from '@/components/G7logo';

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/G7Logo',
        },
        {
            path: '/G7Logo',
            name: 'G7Logo',
            component: G7Logo,
        }
    ]
})
