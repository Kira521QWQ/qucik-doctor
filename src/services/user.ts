import { instance as request } from '@/utils/request';

// 封装用户相关的网络请求

// 密码登录的网络请求
export const loginByPassword = async (mobile: string, password: string) => {
  const res = await request.post('/login/password', {
    mobile: mobile,
    password: password,
  });
  // 把返回数据给到页面
  return res.data.data;
};
