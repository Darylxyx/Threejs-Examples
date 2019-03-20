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
    // 柱状图
    {
      path: '/histogram',
      name: 'histogram',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Histogram.vue'),
    },
    // 饼图
    {
      path: '/pieChart',
      name: 'pieChart',
      component: () => import('./views/PieChart.vue'),
    },
    // 点状球
    {
      path: '/points',
      name: 'points',
      component: () => import('./views/Points'),
    },
  ]
})
