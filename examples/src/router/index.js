import Vue from 'vue';
import Router from 'vue-router';
import Points from '@/view/Points';
import Histogram from '@/view/Histogram';
import Maps from '@/view/Map';
import Shader from '@/view/Shader';
import PieChart from '@/view/PieChart';

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
        },
        {
            path: '/shader',
            name: 'shader',
            component: Shader,
        },
        {
            path: '/pie',
            name: 'pie',
            component: PieChart,
        }
    ]
})
