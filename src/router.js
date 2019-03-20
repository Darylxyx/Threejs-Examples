import Vue from 'vue'
import Router from 'vue-router'
import Earth from './views/Earth.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // 点阵地球
    {
      path: '/',
      name: 'earth',
      component: Earth,
    },
    // 3D地球
    {
      path: '/3DMap',
      name: '3DMap',
      component: () => import('./views/Map3d'),
    },
    // 柱状图
    {
      path: '/histogram',
      name: 'histogram',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Histogram'),
    },
    // 饼图
    {
      path: '/pieChart',
      name: 'pieChart',
      component: () => import('./views/PieChart'),
    },
    // 点状球
    {
      path: '/points',
      name: 'points',
      component: () => import('./views/Points'),
    },
    // 着色器
    {
      path: '/shader',
      name: 'shader',
      component: () => import('./views/Shader'),
    },
  ]
})
