import Vue from 'vue';
import Router from 'vue-router';
import Points from '@/components/Points';
import Histogram from '@/components/Histogram';
import Maps from '@/components/Map';

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/points',
        },
        {
            path: '/points',
            name: 'Points',
            component: Points,
        },
        {
            path: '/histogram',
            name: 'Histogram',
            component: Histogram,
        },
        {
            path: '/map',
            name: 'Map',
            component: Maps,
        }
    ]
})
