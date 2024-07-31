import Vue from 'vue'
import VueRouter from 'vue-router'
// import Layout from '@/layout'

// 获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
const RouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(to) {
  return RouterReplace.call(this, to).catch((err) => err)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index',
    hidden: true
  },
  {
    path: '/index',
    component: () => import('@/views/index.vue')
  }
]
const router = new VueRouter({
  routes
})

export default router
