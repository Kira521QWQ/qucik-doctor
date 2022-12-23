import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

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

export default router;
