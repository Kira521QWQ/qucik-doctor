import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

// 导入进度加载提示库
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 不显示加载提示圈
NProgress.configure({
  showSpinner: false,
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      // 懒加载形式
      component: () => import('@/views/Login/index.vue'),
      meta: { title: '登录' },
    },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/Layout/index.vue'),
      meta: { title: '首页' },
      children: [
        {
          path: '/home',
          component: () => import('@/views/Layout/Home/index.vue'),
          meta: { title: '首页' },
        },
        {
          path: '/article',
          component: () => import('@/views/Layout/Article/index.vue'),
          meta: { title: '健康百科' },
        },
        {
          path: '/notify',
          component: () => import('@/views/Layout/Notify/index.vue'),
          meta: { title: '消息通知' },
        },
        {
          path: '/user',
          component: () => import('@/views/Layout/User/index.vue'),
          meta: { title: '个人中心' },
        },
      ],
    },
    {
      path: '/user/patient',
      component: () => import('@/views/Layout/User/PatientPage.vue'),
      meta: { title: '家庭档案' },
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: { title: '极速问诊' },
    },
    {
      path: '/consult/dept',
      component: () => import('@/views/Consult/ConsultDept.vue'),
      meta: { title: '选择科室' },
    },
    {
      path: '/consult/illness',
      component: () => import('@/views/Consult/ConsultIllness.vue'),
      meta: { title: '病情描述' },
    },
    {
      path: '/test',
      component: () => import('@/views/Test/TestPage.vue'),
      meta: { title: '测试玩' },
    },
  ],
});

// 全局前置路由守卫
router.beforeEach((to) => {
  // document.title = `优医问诊-${to.meta.title}`;

  // 开启加载进度提示
  NProgress.start();

  // 设置页面title
  if (to.meta.title) {
    document.title = '优医问诊-' + to.meta.title;
  } else {
    document.title = '优医问诊';
  }
  // 你访问任何路由之前，都要走这个函数
  // 进入任务路由之前的判断
  // 1、你登录没有
  // 2、你访问的不是 login 页面
  const userStore = useUserStore();
  // if (!userStore.user?.token && to.fullPath !== '/login') return '/login';
  // // 除此之外，放行
  // return true;
  // 上面的代码和这个是等价的
  if (!userStore.user?.token && to.fullPath !== '/login') {
    // 重定向到登录页面
    return '/login';
  } else {
    // 举例：有token且访问的是 /user，放行
    return true;
  }
});

// 全局后置路由
router.afterEach((to) => {
  // 关闭加载进度提示
  NProgress.done();
});

export default router;
