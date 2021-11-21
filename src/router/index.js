import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/User/Users.vue'
import Rights from '@/components/Power/Rights.vue'
import Roles from '@/components/Power/Roles.vue'
import Cate from '@/components/Goods/Cate.vue'
import Params from '@/components/Goods/Params.vue'
import Goods from '@/components/Goods/Goods.vue'
import Add from '@/components/Goods/Add.vue'
import Order from '@/components/Order/Order.vue'

Vue.use(VueRouter)

const routes = [
  // 页面重定向
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order }
    ]
  }
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
