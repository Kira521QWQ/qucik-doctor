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
    { path: '/test', component: () => import('@/views/Test/TestPage.vue') },
  ],
});

export default router;
