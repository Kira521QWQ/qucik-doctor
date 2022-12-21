import axios from 'axios';

// 封装网路请求
// API 请求基地址封装
// 网络请求超时时间封装
export const baseURL = 'https://consult-api.itheima.net/';
export const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});
