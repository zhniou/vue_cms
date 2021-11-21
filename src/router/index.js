import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '@/components/Login.vue'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '@/components/Login.vue')
// import Home from '@/components/Home.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '@/components/Home.vue')
// import Welcome from '@/components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '@/components/Welcome.vue')

// import Users from '@/components/User/Users.vue'
const Users = () => import(/* webpackChunkName:"users_rights_roles" */ '@/components/User/Users.vue')
// import Rights from '@/components/Power/Rights.vue'
const Rights = () => import(/* webpackChunkName:"users_rights_roles" */ '@/components/Power/Rights.vue')
// import Roles from '@/components/Power/Roles.vue'
const Roles = () => import(/* webpackChunkName:"users_rights_roles" */ '@/components/Power/Roles.vue')

// import Cate from '@/components/Goods/Cate.vue'
const Cate = () => import(/* webpackChunkName:"cate_params" */ '@/components/Goods/Cate.vue')
// import Params from '@/components/Goods/Params.vue'
const Params = () => import(/* webpackChunkName:"cate_params" */ '@/components/Goods/Params.vue')

// import Goods from '@/components/Goods/Goods.vue'
const Goods = () => import(/* webpackChunkName:"goods_add" */ '@/components/Goods/Goods.vue')
// import Add from '@/components/Goods/Add.vue'
const Add = () => import(/* webpackChunkName:"goods_add" */ '@/components/Goods/Add.vue')

// import Order from '@/components/Order/Order.vue'
const Order = () => import(/* webpackChunkName:"order_report" */ '@/components/Order/Order.vue')
// import Report from '@/components/Report/Report.vue'
const Report = () => import(/* webpackChunkName:"order_report" */ '@/components/Report/Report.vue')

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
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
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
