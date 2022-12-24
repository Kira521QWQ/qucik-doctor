import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      // 懒加载形式
      component: () => import('@/views/Login/index.vue'),
    },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/Layout/index.vue'),
      children: [
        { path: '/home', component: () => import('@/views/Layout/Home/index.vue') },
        { path: '/article', component: () => import('@/views/Layout/Article/index.vue') },
        { path: '/notify', component: () => import('@/views/Layout/Notify/index.vue') },
        { path: '/user', component: () => import('@/views/Layout/User/index.vue') },
      ],
    },
    { path: '/test', component: () => import('@/views/Test/TestPage.vue') },
  ],
});

// 全局路由守卫
router.beforeEach((to) => {
  // 你访问任何路由之前，我要进行判断
  // 1、你登录没有
  // 2、你访问的不是 login 页面
  const userStore = useUserStore();
  if (!userStore.user?.token && to.fullPath !== '/login') return '/login';

  // 除此之外，放行
  return true;
});

export default router;
