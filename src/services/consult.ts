// 导入axios实例
import { instance as request } from '@/utils/request';

// 导入响应数据的通用类型
import type { Data } from '@/types/user';
// 导入我们文章列表参数类型和响应数据类型
// 响应的具体业务类型
import type { KnowledgeParams, KnowledgePage, PageParams, DoctorPage } from '@/types/consult';

// 获取文章列表网络请求
export const getKnowledgePage = async (params: KnowledgeParams) => {
  // 发起请求
  const res = await request.get<KnowledgePage, Data<KnowledgePage>>('/patient/home/knowledge', {
    params,
  });
  // 返回给页面
  return res.data;
};

// 获取关注医生列表网络请求
export const getDoctorPage = async (params: PageParams) => {
  // 发起请求
  const res = await request.get<DoctorPage, Data<DoctorPage>>('/home/page/doc', { params });
  // 把数据返回给页面
  return res.data;
};

// 关注医生
export const followDoctor = async (id: string) => {
  // 发起请求
  const res = await request.post('/like', { id, type: 'doc' });
  return res.data;
};
