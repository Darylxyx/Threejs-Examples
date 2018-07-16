import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/chapter-1/index';
import Scene from '@/components/chapter-2/scene';
import Geometry from '@/components/chapter-2/geometries';
import Lights from '@/components/chapter-3/lights';

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/chapter-1/index',
            name: 'Index',
            component: Index
        }, {
            path: '/chapter-2/scene',
            name: 'Scene',
            component: Scene,
        }, {
            path: '/chapter-2/geometry',
            name: 'Geometry',
            component: Geometry,
        }, {
            path: '/chapter-3/lights',
            name: 'Lights',
            component: Lights,
        }
    ]
})
