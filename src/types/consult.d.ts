// 文章类型，关注医生的文章|推荐的文章|减脂|饮食
export type KnowledgeType = 'like' | 'recommend' | 'fatReduction' | 'food';

// 文章列表查询参数类型
export type KnowledgeParams = {
  type: KnowledgeType;
  current: number;
  pageSize: number;
};

export type Knowledge = {
  id: string;
  title: string;
  coverUrl: string[];
  // topics: string[];
  topic: string;
  collectionNumber: number;
  commentNumber: number;
  creatorName: string;
  creatorAvatar: string;
  creatorHospatalName: string;
  likeFlag: 0 | 1;
  content: string;
  creatorDep: string;
  creatorTitles: string;
  creatorId: string;
};

export type KnowledgeList = Knowledge[];

// 文章分页，每一页的类型
export type KnowledgePage = {
  pageTotal: number;
  total: number;
  rows: KnowledgeList;
};

// 通用的分页查询参数类型
export type PageParams = {
  // 当前页码
  current: number;
  // 每页条数
  pageSize: number;
};

// 医生 item 对象，对应列表数据的 rows 中的对象
export type Doctor = {
  // 医生ID
  id: string;
  // 医生名称
  name: string;
  // 头像
  avatar: string;
  // 医院名称
  hospitalName: string;
  // 医院等级
  gradeName: string;
  // 科室
  depName: string;
  // 职称
  positionalTitles: string;
  // 是否关注，0 未关注 1 已关注
  likeFlag: 0 | 1;
  // 接诊服务费
  serviceFee: number;
  // 接诊人数
  consultationNum: number;
  // 评分
  score: number;
  // 主攻方向
  major: string;
};

// 医生列表
export type DoctorList = Doctor[];

// 医生分页
export type DoctorPage = {
  pageTotal: number;
  total: number;
  rows: DoctorList;
};

// 问诊记录
export type Consult = {
  // 将来这里会有很多类型
  // 问诊类型
  // 就诊类型1找医生 2极速问诊 3开药问诊默认是1
  type?: 1 | 2 | 3;
  // 快速问诊类型，0 普通 1 三甲
  illnessType?: 0 | 1;
};

// 科室数据的类型
export type FirstDept = {
  // 科室ID
  id: string;
  // 科室名称
  name: string;
  // 二级科室
  child: SecondDept[];
};

// 二级科室
export type SecondDept = {
  // 科室ID
  id: string;
  // 科室名称
  name: string;
  // 科室icon
  avatar?: string;
};
