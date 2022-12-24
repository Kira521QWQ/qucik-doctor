import { instance as request } from '@/utils/request';
import type { User, Data, UserInfo, PatientList } from '@/types/user';

// 封装用户相关的网络请求

// 密码登录的网络请求
export const loginByPassword = async (mobile: string, password: string) => {
  const res = await request.post<User, Data<User>>('/login/password', {
    mobile: mobile,
    password: password,
  });
  // 把返回数据给到页面
  console.log('密码登录的res', res);
  return res.data;
};

// 验证码登录
export const loginByCode = async (mobile: string, code: string) => {
  const res = await request.post<User, Data<User>>('/login', {
    mobile: mobile,
    code: code,
  });
  // 把返回数据给到页面
  return res.data;
};

// 发送验证码请求
export const getSMSCode = async (mobile: string, type: string) => {
  // 发送请求
  const res = await request.get('/code', { params: { mobile, type } });
  return res.data;
};

// 获取个人信息
export const getUserInfo = async () => {
  // 发请求
  const res = await request.get<UserInfo, Data<UserInfo>>('/patient/myUser');
  return res.data;
};

// 获取患者信息列表
export const getPatientList = async () => {
  // 发请求
  const res = await request.get<PatientList, Data<PatientList>>('/patient/mylist');
  return res.data;
};
