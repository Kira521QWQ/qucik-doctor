import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { Toast } from 'vant';
import router from '@/router';

// 封装网路请求
// API 请求基地址封装
// 网络请求超时时间封装
export const baseURL = 'https://consult-api.itheima.net/';
export const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

// 重点明白请求拦截器的执行时间
instance.interceptors.request.use(
  (config) => {
    // 在我们的每次请求发起后，请求头中追加 token
    const userStore = useUserStore();
    // 有token就追加token
    // console.log('追加前', config);
    if (userStore.user?.token && config.headers) {
      // 追加请求头数据
      config.headers['Authorization'] = `Bearer ${userStore.user?.token}`;
    }
    // console.log('追加后', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // console.log('原始res', res);

    // 2、公司业务逻辑的统一处理
    if (res.data.code !== 10000) {
      // 业务逻辑错误发生了,提示用户
      Toast(res.data.message);
      return Promise.reject(res.data.message);
    }

    // 1、数据格式的统一处理
    return res.data;
  },
  (error) => {
    // 3、网络错误的统一处理：401 token过期或者认证失败
    if (error.response.status === 401) {
      // 3.1 清理我们保存的用户信息
      const userStore = useUserStore();
      userStore.delUser();
      // 3.2 从当前失效页面，跳转到登录页面
      // 操作路由：当前是非组件的上下文，想要操作路由只能导入我们自己暴露的路由
      console.log(router.currentRoute.value.fullPath);
      router.push(`/login?returnURL=${router.currentRoute.value.fullPath}`);
    }
    return Promise.reject(error);
  }
);
