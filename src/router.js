import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
    // 点阵地球
    {
      path: '/earth',
      name: 'earth',
      component: () => import('./views/Earth'),
    },
    // 3D地球
    {
      path: '/map',
      name: '3DMap',
      component: () => import('./views/Map3d'),
    },
    {
      path: '/trailer',
      name: 'trailer',
      component: () => import('./views/Trailer'),
    },
    // 柱状图
    {
      path: '/histogram',
      name: 'histogram',
      component: () => import('./views/Histogram'),
    },
    // 饼图
    {
      path: '/pie',
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
    // 反射
    {
      path: '/reflection',
      name: 'reflection',
      component: () => import('./views/Reflection'),
    }
  ]
})
