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

// 验证码登录
export const loginByCode = async (mobile: string, code: string) => {
  const res = await request.post('/login', {
    mobile: mobile,
    code: code,
  });
  // 把返回数据给到页面
  return res.data.data;
};

// 发送验证码请求
export const getSMSCode = async (mobile: string, type: string) => {
  // 发送请求
  const res = await request.get('/code', { params: { mobile, type } });
  return res.data.data;
};
