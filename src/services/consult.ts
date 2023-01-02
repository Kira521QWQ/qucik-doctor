// 导入axios实例
import { instance as request } from '@/utils/request';

// 导入响应数据的通用类型
import type { Data } from '@/types/user';
// 导入我们文章列表参数类型和响应数据类型
// 响应的具体业务类型
import type {
  KnowledgeParams,
  KnowledgePage,
  PageParams,
  DoctorPage,
  FirstDept,
  ConsultOrderPreData,
  Consult,
  ConsultOrderItem,
} from '@/types/consult';

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

// 关注文章
export const followKnowledge = async (id: string) => {
  // 发起请求
  const res = await request.post('/like', { id, type: 'knowledge' });
  return res.data;
};

// 获取所有科室数据
export const getAllDept = async () => {
  // 发起请求
  const res = await request.get<FirstDept[], Data<FirstDept[]>>('/dep/all');
  return res.data;
};

// 上传图片
export const uploadImage = async (file: File) => {
  // 类似于这个 {name: 'Rose'}
  // 组装一个文件传送对象
  const fd = new FormData();
  // 追加我们要上传的图片, append 的第一个参数是服务器API定的
  // {} => {name: 'Rose'}
  fd.append('file', file);
  const res = await request.post<{ id: string; url: string }, Data<{ id: string; url: string }>>(
    '/upload',
    fd
  );
  return res.data;
};

// 订单支付准备
export const getConsultOrderPre = async (type: 1 | 2 | 3, illnessType: 0 | 1) => {
  // 发起请求
  const res = await request.get<ConsultOrderPreData, Data<ConsultOrderPreData>>(
    '/patient/consult/order/pre',
    { params: { type, illnessType } }
  );
  return res.data;
};

// 创建极速问诊订单
export const createConsultOrder = async (data: Consult) => {
  // 发起请求
  const res = await request.post<{ id: string }, Data<{ id: string }>>(
    '/patient/consult/order',
    data
  );
  return res.data;
};

// 获取第三方支付地址
export const getConsultOrderPayUrl = async (data: {
  paymentMethod: 0 | 1;
  orderId: string;
  payCallback: string;
}) => {
  // 发起请求
  const res = await request.post<{ payUrl: string }, Data<{ payUrl: string }>>(
    '/patient/consult/pay',
    data
  );
  return res.data;
};

// 获取问诊订单详情
export const getConsultOrderDetail = async (id: string) => {
  // 发起请求
  const res = await request.get<ConsultOrderItem, Data<ConsultOrderItem>>(
    '/patient/consult/order/detail',
    { params: { orderId: id } }
  );

  return res.data;
};

// 获取处方预览图片地址
export const getPrescriptionPic = async (id: string) => {
  // 发起请求
  const res = await request.get<{ url: string }, Data<{ url: string }>>(
    `/patient/consult/prescription/${id}`
  );
  return res.data;
};
