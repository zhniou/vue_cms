import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'

Vue.use(VueRouter)

const routes = [
  // 页面重定向
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  // 获取token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有登录
  if (!tokenStr) {
    return next('/login')
  }
  // 若访问的其他页面，且存在token值
  next()
})

export default router
