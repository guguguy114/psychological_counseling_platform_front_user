import Vue from 'vue'
import VueRouter from 'vue-router'
import authToken from '@/utils/authToken'
import store from '@/store'
import { Message } from 'element-ui'

Vue.use(VueRouter)

// 解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;

// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};

const routes = [
  {
    path: '/',
    name: 'login',
    meta: {
      title: '登录',
    },
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/main',
    name: 'main',
    meta: { title: '主页', },
    component: () => import('@/views/MainView.vue'),
    children: [
      {
        path: '/main/wallet',
        name: 'wallet',
        meta: { title: '我的账户', },
        component: () => import('@/views/WalletView.vue')
      },
      {
        path: '/main/assessment',
        name: 'assessment',
        meta: { title: '在线评估', },
        component: () => import('@/views/AssessmentView.vue')
      },
      {
        path: '/main/my_report',
        name: 'my_port',
        meta: { title: '我的报告', },
        component: () => import('@/views/MyReportView.vue')
      },
      {
        path: '/main/create_appointment',
        name: 'create_appointment',
        meta: { title: '我要预约', },
        component: () => import('@/views/CreateAppointmentView.vue'),
      },
      {
        path: '/main/consultant_lib',
        name: 'consultant_lib',
        meta: { title: '咨询师库', },
        component: () => import('@/views/ConsultantLibView.vue')
      }
      
    ]
  },
  {
    path: '/enroll',
    name: 'enroll',
    meta: { title: '注册', },
    component: () => import('@/views/EnrollView.vue')
  }
]

const whiteList = ["/", "/enroll"];

const router = new VueRouter({
  mode: 'hash',
  routes
})

// 全局前置路由守卫配置在这
router.beforeEach((to, from, next) => {
  /* 
   to 表示将要访问的路由对象
   from 来的路由对象
   next 放行
  */
  console.log("to", to);
  console.log("from", from);
  // 如果路径在数组返回index没有在数组里面就返回-1
  if (whiteList.indexOf(to.path) !== -1) {
    to.meta.title && (document.title = to.meta.title);
    next();
  } else {
    // 如果有登录信息，允许登录
    // if (sessionStorage.getItem("admin")) {
    // 这里使用vuex判断
    // if (store.state.userData.adminId !== undefined) {
    if (authToken.getToken()) {
      console.log("token存在");
      console.log(store);

      if (store.state.userData.adminId === undefined) {
        console.log("vuex不存在");
        store.dispatch("getadmininfobytoken");
      }
      to.meta.title && (document.title = to.meta.title);
      next();
    } else {
      // 没有登录
      // 跳转到登录页
      Message.error("请先登录");
      // 这里如果通过router.push跳转没办法自己跳自己
      // router.push("/");
      // 需要实现：没有登录跳转到登录，登录后跳转到main
      // 需要不能相同
      if (from.path !== to.path && to.path !== "/") {
        console.log("redirect to login");
        to.meta.title && (document.title = to.meta.title);
        next(
          {
            path: "/",
            query: {
              redirect: to.path,
            },
          }
        );
      }
    }
  }
})

export default router
