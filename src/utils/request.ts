import axios from 'axios';

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
    // 打印观察 config 里面已经有关于某次请求的配置参数
    console.log('项目请求后，浏览器发出前执行', config);
    // 别忘了，返回config对象，axios就拿到了，项目请求配置和我们做的额外配置的总和
    // 发出了这次请求
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 你有机会先于项目对返回数据做处理
    console.log('浏览器处理后，项目处理前执行', res);
    return res;
  },
  (error) => {
    Promise.reject(error);
  }
);
